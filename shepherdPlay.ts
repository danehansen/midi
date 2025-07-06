import dataViz from './dataViz';
import addToKeyboardState from './addToKeyboardState';
import { getInput, getOutput } from './getPuts';
import { MidiRange } from './const';
import { MidiMessage } from 'midi';
import shepherdMessage from './shepherdMessage';
import killAll from './killAll';
import { RANI_PIANO_CALIBRATION } from './const';

const MAX_VELOCITY = Math.round(MidiRange.HIGH * 0.5);

const CALIBRATION = RANI_PIANO_CALIBRATION;
// const CALIBRATION = undefined;

const INPUT_NAME = 'WIDI green Bluetooth';
// const INPUT_NAME = 'WIDI orange Bluetooth';

// const OUTPUT_NAME = 'WIDI green Bluetooth';
const OUTPUT_NAME = 'WIDI orange Bluetooth';
// const OUTPUT_NAME = undefined;

export default async function shepherdPlay() {
  let dead = false;
  let inputState = addToKeyboardState();
  let outputState = addToKeyboardState();
  const input = getInput(INPUT_NAME);
  const output = await getOutput(OUTPUT_NAME);

  input.on('message', listener);
  console.log('listening...');

  function listener(deltaTime, message) {
    const [status, pitch, velocity] = message;
    inputState = addToKeyboardState([[status, pitch, velocity]], inputState);
    const { messages } = shepherdMessage([status, pitch, velocity], undefined, undefined, {
      maxVelocity: MAX_VELOCITY,
      pianoCalibration: CALIBRATION,
    })
    messages.forEach(([, p,]) => {
      const message: MidiMessage = [status, p, velocity];
      outputState = addToKeyboardState([message], outputState);
    })
    dataViz(outputState);
    console.log({ deltaTime, message })
    // dataViz(inputState);
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
