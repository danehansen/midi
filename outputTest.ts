import { MidiMessage } from 'midi';
import { MidiMessageStatus, MidiRange } from './const';
import sleep from './sleep';
import addToKeyboardState from './addToKeyboardState';
import dataViz from './dataViz';
import { getOutput } from './getPuts';
import killAll from './killAll';

const MIDDLE_C = 60;
const DURATION = 500;
const MAX_VELOCITY = Math.round(MidiRange.HIGH * 0.5);

const OUTPUT_NAME = 'WIDI green Bluetooth';
// const OUTPUT_NAME = 'WIDI orange Bluetooth';

export default async function outputTest() {
  let dead = false;
  let outputState = addToKeyboardState();
  const output = await getOutput(OUTPUT_NAME, true);

  noteOn();

  async function noteOn() {
    if (dead) {
      return;
    }
    const message: MidiMessage = [MidiMessageStatus.NOTE_ON, MIDDLE_C, MAX_VELOCITY]
    output.sendMessage(message);
    outputState = addToKeyboardState([message], outputState);
    dataViz(outputState);
    console.log({ message })
    await sleep(DURATION);
    if (!dead) {
      await noteOff();
    }
  }

  async function noteOff() {
    if (dead) {
      return;
    }
    const message: MidiMessage = [MidiMessageStatus.NOTE_OFF, MIDDLE_C, MidiRange.LOW]
    output.sendMessage(message);
    outputState = addToKeyboardState([message], outputState);
    dataViz(outputState);
    console.log({ message })
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
