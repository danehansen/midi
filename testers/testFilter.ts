import { Filter } from "../handlers/filters";
import { MidiMessageStatus, MidiRange } from "../utils/const";
import dataViz from "../utils/dataViz";
import { KeyboardState, Velocity } from "../utils/types";

export default function testFilter(filter: Filter, options?: any, velocity: Velocity = MidiRange.MAX) {
  const outputState: KeyboardState = {};

  for (let pitch = MidiRange.MIN; pitch <= MidiRange.MAX; pitch++) {
    outputState[pitch] = filter([MidiMessageStatus.NOTE_ON, pitch, velocity], options)
  }

  dataViz(outputState);
}