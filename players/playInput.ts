import { Input, MidiMessage } from "midi";
import { getInput, getOutput } from "../utils/getPorts";
import killAll from "../utils/killAll";
import { getKEyQHandler, getPianoCalibrationHandler, getShepardizeHandler, getRandomizeOctaveHandler } from "../handlers";
import ascend from "../handlers/ascend";
import echo from "../handlers/echo";
import { Queue } from "../utils/queue";

const INPUT_NAME = 'WIDI orange Bluetooth';
const OUTPUT_NAME = 'WIDI green Bluetooth';

export async function playInput(): Promise<void> {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const queue = new Queue(output.sendMessage)
  let input: Input;

  const q = new Queue((arg) => { console.log('noop', arg) })

  const modifierLast = getKEyQHandler(finalCallback);
  // const modifierSecond = getPianoCalibrationHandler(modifierLast);
  // const modifierFirst = getShepardizeHandler(modifierLast);
  // const modifierFirst = getRandomizeOctaveHandler(modifierLast);

  input = await getInput(INPUT_NAME);
  input.on('message', inputListener);
  console.log('listening...');
  process.on('SIGINT', destroy);

  function inputListener(deltaTime: number, message: MidiMessage) {
    // modifierFirst(message)
    // echo(message, modifierLast);
    ascend(message, modifierLast);
  }

  function finalCallback(m: MidiMessage) {
    queue.insertMessage(m);
    queue.vizualize();
  }

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    queue.kill();
    killAll(output);
    input.off('message', inputListener);
    console.log('closing input...')
    input.closePort();
    console.log('closing output...')
    output.closePort();
    process.exitCode = 0;
  }
}