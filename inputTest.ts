import dataViz from './dataViz';
import addToKeyboardState from './addToKeyboardState';
import { getInput } from './getPuts';
import { MidiMessage } from 'midi';

const INPUT_NAME = 'WIDI green Bluetooth';
// const INPUT_NAME = 'WIDI orange Bluetooth';

export default async function inputTest() {
  const input = await getInput(INPUT_NAME);
  let inputState = addToKeyboardState();

  input.on('message', listener);
  console.log('listening...');

  function listener(deltaTime: number, message: MidiMessage) {
    inputState = addToKeyboardState([message], inputState);
    dataViz(inputState);
    const [status, pitch, velocity] = message;
    console.log({ deltaTime, status, pitch, velocity });
  }

  process.on('SIGINT', () => {
    input.off('message', listener);
    input.closePort();
    process.exit(0);
  });
}
