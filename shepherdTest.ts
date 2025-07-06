import { MidiMessage } from 'midi';
import { MidiMessageStatus, MidiRange, OCTAVE_SIZE } from './const';
import sleep from './sleep';
import dataViz from './dataViz';
import shepherdMessage from './shepherdMessage';
import addToKeyboardState from './addToKeyboardState';
import { getOutput } from './getPuts';
import killAll from './killAll';
import { RANI_PIANO_CALIBRATION } from './const';

const MAX_VELOCITY = Math.round(MidiRange.HIGH * 0.5);

const DURATION = 100;
const CALIBRATION = RANI_PIANO_CALIBRATION;
// const CALIBRATION = undefined;

// const OUTPUT_NAME = 'WIDI green Bluetooth';
// const OUTPUT_NAME = 'WIDI orange Bluetooth';
const OUTPUT_NAME = undefined;

export default async function shepherdTest() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME);
  let outputState = addToKeyboardState();
  let currentPitch = 1;

  noteOn();

  // for (let i = 0; i < OCTAVE_SIZE; i++) {
  //   const { messages } = shepherdMessage([MidiMessageStatus.NOTE_ON, i,
  //   Math.round(MidiRange.HIGH * 0.5)
  //   ], undefined, undefined, {
  //     maxVelocity: MAX_VELOCITY,
  //     pianoCalibration: CALIBRATION,
  //   })
  //   outputState = addToKeyboardState(messages, outputState)
  //   messages.forEach((message) => output.sendMessage(message));
  // }
  // dataViz(outputState);

  async function noteOn() {
    if (dead) {
      return;
    }
    const message: MidiMessage = [MidiMessageStatus.NOTE_ON, currentPitch, MidiRange.HIGH];
    const { messages } = shepherdMessage(message, undefined, undefined, {
      maxVelocity: MAX_VELOCITY,
      pianoCalibration: CALIBRATION,
    });
    messages.forEach((message) => output.sendMessage(message));
    outputState = addToKeyboardState(messages, outputState);
    dataViz(outputState);
    console.log({ message })
    await sleep(DURATION);
    if (dead) {
      return;
    }
    await noteOff();
  }

  async function noteOff() {
    if (dead) {
      return;
    }
    const message = [MidiMessageStatus.NOTE_OFF, currentPitch, MidiRange.LOW] as MidiMessage;
    const { messages } = shepherdMessage(message);
    messages.forEach((message) => output.sendMessage(message));
    outputState = addToKeyboardState(messages, outputState);
    dataViz(outputState);
    await sleep(DURATION);
    currentPitch = (currentPitch + 1) % OCTAVE_SIZE;
    if (dead) {
      return;
    }
    await noteOn();
  }

  process.on('SIGINT', () => {
    dead = true;
    killAll(output);
    output.closePort();
    process.exit(0);
  });
}

