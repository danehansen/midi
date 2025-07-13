import dataViz from '../utils/dataViz';
import { getInput } from '../utils/getPuts';
import { MidiMessage } from 'midi';
import { MidiMessageStatusMap } from '../utils/const';
import { KeyboardState } from '../utils/types';
import { getPitch } from '../utils/getMessageProps';

const INPUT_NAME = 'WIDI green Bluetooth';

export default async function testInput() {
  const input = await getInput(INPUT_NAME);
  let inputState: KeyboardState = {};

  input.on('message', listener);
  console.log('listening...');

  function listener(deltaTime: number, message: MidiMessage) {
    inputState[getPitch(message)] = message;
    dataViz(inputState);
    const [status, pitch, velocity] = message;
    console.log({ deltaTime, status: MidiMessageStatusMap[status], pitch, velocity })
  }

  process.on('SIGINT', () => {
    input.off('message', listener);
    input.closePort();
    process.exit(0);
  });
}
