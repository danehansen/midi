import { MidiMessage } from "midi";
import { getPitch } from "../utils/getMessageProps";
import dataViz from "../utils/dataViz";
import { getOutput } from "../utils/getPorts";
import killAll from "../utils/killAll";
import { getRandomizeOctaveHandler, getPianoCalibrationHandler, getKEyQHandler, getShepardizeHandler } from "../handlers";
import { MidiMessageStatus, MidiRange } from "../utils/const";
import { KeyboardState } from "../utils/types";
import sleep from "../utils/sleep";

const OUTPUT_NAME = 'WIDI orange Bluetooth';
const VELOCITY = 100;
const DURATION = 100;

export async function playTester() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const outputState: KeyboardState = {};

  // const modifierLast = getKEyQHandler(finalCallback);
  // const modifierLast = getPianoCalibrationHandler(finalCallback);
  // const modifierSecond = getPianoCalibrationHandler(modifierLast);
  // const modifierFirst = getShepardizeHandler(modifierLast);
  const modifierFirst = getRandomizeOctaveHandler(finalCallback);
  // const modifierFirst = getPianoCalibrationHandler(finalCallback);

  console.log('testing...');
  process.on('SIGINT', destroy);
  await noteOn();

  async function noteOn(pitch: number = MidiRange.MIN) {
    let message: MidiMessage = [MidiMessageStatus.NOTE_ON, pitch, VELOCITY];
    modifierFirst(message);
    await sleep(DURATION);
    if (dead) {
      return;
    }
    message = [MidiMessageStatus.NOTE_OFF, pitch, MidiRange.MIN]
    modifierFirst(message);
    pitch++;
    if (pitch > MidiRange.MAX) {
      pitch = MidiRange.MIN;
    }
    if (!dead) {
      await noteOn(pitch);
    }
  }

  function finalCallback(m: MidiMessage) {
    const p = getPitch(m);
    outputState[p] = m;
    // dataViz(outputState);
    const velocity = m[2];
    if (!isNaN(velocity)) {
      output.sendMessage(m);
    }
    // console.log(m);
  }

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    killAll(output);
    console.log('closing output...')
    output.closePort();
    process.exitCode = 0;
  }
}