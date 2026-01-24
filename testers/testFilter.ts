import { Filter } from "../handlers/filters";
import { MidiMessageStatus, MidiRange } from "../utils/const";
import { Queue } from "../utils/queue";
import { Velocity } from "../utils/types";

export default function testFilter(filter: Filter, options?: any, velocity: Velocity = MidiRange.MAX): void {
  const queue = new Queue();

  for (let pitch = MidiRange.MIN; pitch <= MidiRange.MAX; pitch++) {
    queue.insertMessage(filter([MidiMessageStatus.NOTE_ON, pitch, velocity], options))
  }
  queue.vizualize();
}