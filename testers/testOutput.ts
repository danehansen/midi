import { MidiMessage } from 'midi';
import { MidiMessageStatus, MidiMessageStatusMap, MidiRange } from '../utils/const';
import sleep from '../utils/sleep';
import dataViz from '../utils/dataViz';
import { getOutput } from '../utils/getPorts';
import killAll from '../utils/killAll';
import { getPitch } from '../utils/getMessageProps';
import { Queue } from '../utils/queue';

const MIDDLE_C = 60;
const DURATION = 500;
const MAX_VELOCITY = Math.round(MidiRange.MAX * 0.5);

const OUTPUT_NAME = 'WIDI green Bluetooth';

export default async function testOutput(): Promise<void> {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const queue = new Queue(output.sendMessage);

  noteOn();
  process.on('SIGINT', destroy);

  async function noteOn() {
    if (dead) {
      return;
    }
    const message: MidiMessage = [MidiMessageStatus.NOTE_ON, MIDDLE_C, MAX_VELOCITY]
    queue.insertMessage(message);
    queue.vizualize();
    const [status, pitch, velocity] = message;
    console.log({ status: MidiMessageStatusMap[status as MidiMessageStatus], pitch, velocity })
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
    queue.insertMessage(message);
    queue.vizualize();
    const [status, pitch, velocity] = message;
    console.log({ status: MidiMessageStatusMap[status as MidiMessageStatus], pitch, velocity })
    await sleep(DURATION);
    if (!dead) {
      await noteOn();
    }
  }

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    queue.kill();
    killAll(output);
    console.log('closing output...')
    output.closePort();
    process.exitCode = 0;
  }
}
