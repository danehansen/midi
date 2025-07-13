import { Input, MidiMessage } from "midi";
import { getPitch } from "../utils/getMessageProps";
import dataViz from "../utils/dataViz";
import { getInput, getOutput } from "../utils/getPuts";
import killAll from "../utils/killAll";
import { kEyQModifier } from "../filters/kEyQ";
import { shepardizeModifier } from '../transforms/shepardizeMidiMessage'
import { pianoCalibrationModifier } from "../filters/pianoCalibration";
import { randomizePitchModifier } from "../transforms/randomizePitch";
import { KeyboardState } from "../utils/types";

const INPUT_NAME = 'WIDI green Bluetooth';
const OUTPUT_NAME = 'WIDI orange Bluetooth';

export async function playInput() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const outputState: KeyboardState = {};
  let input: Input;

  const modifierLast = kEyQModifier(finalCallback);
  // const modifierSecond = pianoCalibrationModifier(modifierLast);
  const modifierFirst = shepardizeModifier(modifierLast);
  // const modifierFirst = randomizePitchModifier(modifierLast);

  input = await getInput(INPUT_NAME);
  input.on('message', inputListener);
  console.log('listening...');
  process.on('SIGINT', destroy);

  function inputListener(deltaTime: number, message: MidiMessage) {
    modifierFirst(message)
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