import dataViz from './dataViz';
import addToKeyboardState from './addToKeyboardState';
import { getInput } from './getPuts';

const INPUT_NAME = 'WIDI green Bluetooth';
// const INPUT_NAME = 'WIDI orange Bluetooth';

export default function inputTest() {
  const input = getInput(INPUT_NAME);
  let inputState = addToKeyboardState();

  input.on('message', listener);
  console.log('listening...');

  function listener(deltaTime, message) {
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
