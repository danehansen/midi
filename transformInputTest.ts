import dataViz from './dataViz';
import addToKeyboardState from './addToKeyboardState';
import { getInput, getOutput } from './getPuts';
import { Pitch } from './types';
import getOctavesOfPitch from './getOctavesOfPitch';
import math from '@danehansen/math';
import { MidiMessageStatus, MidiRange, PianoRange } from './const';
import { MidiMessage } from 'midi';
import killAll from './killAll';

const MAX_VELOCITY = Math.round(MidiRange.HIGH * 0.5);

const INPUT_NAME = 'WIDI green Bluetooth';
// const INPUT_NAME = 'WIDI orange Bluetooth';

// const OUTPUT_NAME = 'WIDI green Bluetooth';
const OUTPUT_NAME = 'WIDI orange Bluetooth';
// const OUTPUT_NAME = undefined;

export default async function transformInputTest() {
  let dead = false;
  const pitchMapping: Record<Pitch, Pitch> = {}
  let inputState = addToKeyboardState();
  let outputState = addToKeyboardState();
  const input = await getInput(INPUT_NAME);
  const output = await getOutput(OUTPUT_NAME, true);

  input.on('message', listener);
  console.log('listening...');

  function listener(deltaTime: number, message: MidiMessage) {
    const [status, pitch, velocity] = message;
    if (status === MidiMessageStatus.NOTE_OFF || MidiMessageStatus.NOTE_ON) {
      inputState = addToKeyboardState([message], inputState);

      let alteredMessage: MidiMessage;

      if (status === MidiMessageStatus.NOTE_OFF || !velocity) {
        let mappedPitch = pitchMapping[pitch];
        if (typeof mappedPitch !== 'number') {
          console.warn(`mappedPitch not found`, { pitchMapping, pitch })
          mappedPitch = pitch;
          // throw new Error(`mappedPitch not found`)
        }
        alteredMessage = [status, mappedPitch, MAX_VELOCITY];
        delete pitchMapping[pitch];
      } else {
        const octaves = getOctavesOfPitch(pitch).filter((p) => {
          return !pitchMapping[p] && p >= PianoRange.LOW && p <= PianoRange.HIGH;
        })
        const randomPitch = math.randomItem(octaves)
        pitchMapping[pitch] = randomPitch;
        alteredMessage = [status, randomPitch, MAX_VELOCITY];
      }
      output.sendMessage(alteredMessage);
      outputState = addToKeyboardState([alteredMessage], outputState);
      dataViz(outputState);
      // dataViz(inputState);
      console.log({ deltaTime, alteredMessage, message })
    }
  }

  process.on('SIGINT', () => {
    dead = true;
    killAll(output);
    input.off('message', listener);
    input.closePort();
    output.closePort();
    process.exit(0);
  });
}
