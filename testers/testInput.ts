import dataViz from '../utils/dataViz';
import { getInput } from '../utils/getPorts';
import { MidiMessage } from 'midi';
import { MidiMessageStatusMap } from '../utils/const';
import { KeyboardState } from '../utils/types';
import { getPitch } from '../utils/getMessageProps';

const INPUT_NAME = 'WIDI green Bluetooth';

export default async function testInput() {
  let dead = false;
  const input = await getInput(INPUT_NAME);
  let inputState: KeyboardState = {};

  input.on('message', inputListener);
  process.on('SIGINT', destroy);
  console.log('listening...');

  function inputListener(deltaTime: number, message: MidiMessage) {
    inputState[getPitch(message)] = message;
    dataViz(inputState);
    const [status, pitch, velocity] = message;
    console.log({ deltaTime, status: MidiMessageStatusMap[status], pitch, velocity })
  }

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    input.off('message', inputListener);
    console.log('closing input...')
    input.closePort();
    process.exitCode = 0;
  }
}
