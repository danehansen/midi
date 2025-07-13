import { MidiMessage } from 'midi';
import { MidiMessageStatus, MidiMessageStatusMap, MidiRange } from '../utils/const';
import sleep from '../utils/sleep';
import dataViz from '../utils/dataViz';
import { getOutput } from '../utils/getPuts';
import killAll from '../utils/killAll';
import { KeyboardState } from '../utils/types';
import { getPitch } from '../utils/getMessageProps';

const MIDDLE_C = 60;
const DURATION = 500;
const MAX_VELOCITY = Math.round(MidiRange.MAX * 0.5);

const OUTPUT_NAME = 'WIDI green Bluetooth';

export default async function testOutput() {
  let dead = false;
  let outputState: KeyboardState = {};
  const output = await getOutput(OUTPUT_NAME, true);

  noteOn();

  async function noteOn() {
    if (dead) {
      return;
    }
    const message: MidiMessage = [MidiMessageStatus.NOTE_ON, MIDDLE_C, MAX_VELOCITY]
    output.sendMessage(message);
    outputState[getPitch(message)] = message;
    dataViz(outputState);
    const [status, pitch, velocity] = message;
    console.log({ status: MidiMessageStatusMap[status], pitch, velocity })
    await sleep(DURATION);
    if (!dead) {
      await noteOff();
    }
  }

  async function noteOff() {
    if (dead) {
      return;
    }
    const message: MidiMessage = [MidiMessageStatus.NOTE_OFF, MIDDLE_C, MidiRange.MIN]
    output.sendMessage(message);
    outputState[getPitch(message)] = message;
    dataViz(outputState);
    const [status, pitch, velocity] = message;
    console.log({ status: MidiMessageStatusMap[status], pitch, velocity })
    await sleep(DURATION);
    if (!dead) {
      await noteOn();
    }
  }

  process.on('SIGINT', () => {
    dead = true;
    killAll(output);
    output.closePort();
    process.exit(0);
  });
}
