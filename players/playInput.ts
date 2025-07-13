import { Input, MidiMessage } from "midi";
import { getPitch } from "../utils/getMessageProps";
import dataViz from "../utils/dataViz";
import { getInput, getOutput } from "../utils/getPorts";
import killAll from "../utils/killAll";
import { kEyQModifier } from "../filters/kEyQ";
import { shepardizeModifier } from '../transforms/shepardize'
import { pianoCalibrationModifier } from "../filters/pianoCalibration";
import { randomizeOctaveModifier } from "../transforms/randomizeOctave";
import { KeyboardState } from "../utils/types";
import ascend from "../modifiers/ascend";
import echo from "../modifiers/echo";

const INPUT_NAME = 'WIDI green Bluetooth';
const OUTPUT_NAME = 'WIDI orange Bluetooth';

export async function playInput() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const outputState: KeyboardState = {};
  let input: Input;

  const modifierLast = kEyQModifier(finalCallback);
  // const modifierSecond = pianoCalibrationModifier(modifierLast);
  // const modifierFirst = shepardizeModifier(modifierLast);
  // const modifierFirst = randomizeOctaveModifier(modifierLast);

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
    dead = true;
    killAll(output);
    input.off('message', inputListener);
    input.closePort();
    output.closePort();
    process.exit(0);
  }
}