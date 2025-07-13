import { MidiMessage } from "midi";
import { getPitch } from "../utils/getMessageProps";
import dataViz from "../utils/dataViz";
import { getOutput } from "../utils/getPuts";
import killAll from "../utils/killAll";
import { kEyQModifier } from "../filters/kEyQ";
import { shepardizeModifier } from '../transforms/shepardizeMidiMessage'
import { pianoCalibrationModifier } from "../filters/pianoCalibration";
import { randomizePitchModifier } from "../transforms/randomizePitch";
import { MidiMessageStatus, MidiRange } from "../utils/const";
import { KeyboardState } from "../utils/types";
import sleep from "../utils/sleep";

const OUTPUT_NAME = 'WIDI orange Bluetooth';
const VELOCITY = 10;
const DURATION = 100;

export async function playTester() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const outputState: KeyboardState = {};

  // const modifierLast = kEyQModifier(finalCallback);
  // const modifierLast = pianoCalibrationModifier(finalCallback);
  // const modifierSecond = pianoCalibrationModifier(modifierLast);
  // const modifierFirst = shepardizeModifier(modifierLast);
  // const modifierFirst = randomizePitchModifier(modifierLast);
  const modifierFirst = pianoCalibrationModifier(finalCallback);

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
    console.log(m)
    // dataViz(outputState);
    output.sendMessage(m);
  }

  async function destroy() {
    dead = true;
    await sleep(DURATION * 1.1);
    killAll(output);
    output.closePort();
    process.exit(0);
  }
}