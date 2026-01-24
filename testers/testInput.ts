import { getInput } from '../utils/getPorts';
import { MidiMessage } from 'midi';
import { MidiMessageStatus, MidiMessageStatusMap } from '../utils/const';
import { Queue } from '../utils/queue';

const INPUT_NAME = 'WIDI orange Bluetooth';

export default async function testInput(): Promise<void> {
  let dead = false;
  const input = await getInput(INPUT_NAME);
  const queue = new Queue();

  input.on('message', inputListener);
  process.on('SIGINT', destroy);
  console.log('listening...');

  function inputListener(deltaTime: number, message: MidiMessage) {
    queue.insertMessage(message, deltaTime);
    queue.vizualize();
    const [status, pitch, velocity] = message;
    console.log({ deltaTime, status: MidiMessageStatusMap[status as MidiMessageStatus], pitch, velocity })
  }

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    queue.kill();
    input.off('message', inputListener);
    console.log('closing input...')
    input.closePort();
    process.exitCode = 0;
  }
}
