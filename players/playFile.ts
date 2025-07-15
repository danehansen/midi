import { MidiMessage } from "midi";
import { KeyboardState, MidiConstructor } from "../utils/types";
import { getPitch, getStatus } from "../utils/getMessageProps";
import dataViz from "../utils/dataViz";
import { getOutput } from "../utils/getPorts";
import killAll from "../utils/killAll";
import { readFile } from 'fs/promises';
import JZZ from 'jzz';
import SMF from 'jzz-midi-smf';
import { MidiMessageStatus } from "../utils/const";
import { kEyQModifier } from "../filters/kEyQ";
import { shepardizeModifier } from '../transforms/shepardize'
import { pianoCalibrationModifier } from "../filters/pianoCalibration";
import { randomizeOctaveModifier } from "../transforms/randomizeOctave";
import sleep from "../utils/sleep";

const OUTPUT_NAME = 'WIDI orange Bluetooth';

SMF(JZZ);

export async function playFile(midiFile: string) {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const outputState: KeyboardState = {};

  const modifierLast = kEyQModifier(finalCallback);
  // const modifierSecond = pianoCalibrationModifier(modifierLast);
  // const modifierFirst = shepardizeModifier(modifierLast);
  // const modifierFirst = randomizeOctaveModifier(modifierLast);
  const modifierFirst = randomizeOctaveModifier(modifierLast);

  const smf = new (JZZ.MIDI as MidiConstructor).SMF(await readFile(midiFile, 'binary'));
  const player = smf.player();
  player.connect({ send });
  player.play();
  console.log('playing...');
  process.on('SIGINT', destroy);

  function send(message: MidiMessage) {
    const status = getStatus(message);
    if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
      modifierFirst(message);
    }
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
    player.stop();
    player.disconnect();
    killAll(output);
    console.log('closing output...')
    output.closePort();
    process.exitCode = 0;
  }
}
