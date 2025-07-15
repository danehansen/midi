import { Input, MidiMessage } from "midi";
import { getPitch } from "../utils/getMessageProps";
import dataViz from "../utils/dataViz";
import { getInput, getOutput } from "../utils/getPorts";
import killAll from "../utils/killAll";
import { getKEyQHandler, getPianoCalibrationHandler, getShepardizeHandler, getRandomizeOctaveHandler } from "../handlers";
import { KeyboardState } from "../utils/types";
import ascend from "../handlers/ascend";
import echo from "../handlers/echo";

const INPUT_NAME = 'WIDI green Bluetooth';
const OUTPUT_NAME = 'WIDI orange Bluetooth';

export async function playInput() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const outputState: KeyboardState = {};
  let input: Input;

  const modifierLast = getKEyQHandler(finalCallback);
  // const modifierSecond = getPianoCalibrationHandler(modifierLast);
  // const modifierFirst = getShepardizeHandler(modifierLast);
  // const modifierFirst = getRandomizeOctaveHandler(modifierLast);

  input = await getInput(INPUT_NAME);
  input.on('message', inputListener);
  console.log('listening...');
  process.on('SIGINT', destroy);

  function inputListener(deltaTime: number, message: MidiMessage) {
    // modifierFirst(message)
    // echo(message, modifierLast);
    ascend(message, modifierLast);
  }

  function finalCallback(m: MidiMessage) {
    const p = getPitch(m);
    outputState[p] = m;
    dataViz(outputState);
    output.sendMessage(m);
  }

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    killAll(output);
    input.off('message', inputListener);
    console.log('closing input...')
    input.closePort();
    console.log('closing output...')
    output.closePort();
    process.exitCode = 0;
  }
}