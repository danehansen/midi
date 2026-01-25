import { MidiMessage } from "midi";
import { getOutput } from "../utils/getPorts";
import killAll from "../utils/killAll";
import { MidiMessageStatus } from "../utils/const";
import { Queue } from "../utils/queue";
import { getPitch } from "../utils/getMessageProps";
import m from "@danehansen/math";

const VELOCITY = 100;
const MIDDLE_C = 60;

export async function testSpeed(outputName: string): Promise<void> {
  let dead = false;
  const output = await getOutput(outputName, true);
  const queue = new Queue(output.sendMessage);

  console.log('testing...');
  process.on('SIGINT', destroy);

  let notesPerSecond = 400; // 400 seems good on bluetooth to korg
  // 330 breaks up on korg using h4midiwc
  let num = 0;
  let lastMessage: MidiMessage | undefined;
  let interval = startInterval();

  function startInterval() {
    num = 0;
    notesPerSecond++;
    console.log({ notesPerSecond })
    return setInterval(onInterval, 1000 / notesPerSecond)
  }

  function onInterval() {
    if (num === notesPerSecond) {
      clearInterval(interval);
      interval = startInterval();
    }
    if (lastMessage) {
      queue.insertMessage([MidiMessageStatus.NOTE_OFF, getPitch(lastMessage), 0])
    }
    queue.stopAll();
    let message: MidiMessage;
    if (num < notesPerSecond / 2) {
      message = [MidiMessageStatus.NOTE_ON, m.random(MIDDLE_C - 12, MIDDLE_C), VELOCITY];
    } else {
      message = [MidiMessageStatus.NOTE_ON, m.random(MIDDLE_C + 12, MIDDLE_C + 24), VELOCITY];
    }
    queue.insertMessage(message);
    lastMessage = message;
    num++;
  }

  function destroy() {
    if (dead) {
      return;
    }
    clearInterval(interval);
    dead = true;
    queue.kill();
    killAll(output);
    console.log('closing output...', { notesPerSecond })
    output.closePort();
    process.exitCode = 0;
  }
}