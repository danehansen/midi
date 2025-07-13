import { MidiMessageStatus, MidiRange } from "./const";
import babar from 'babar';
import { KeyboardState } from "./types";

export default function dataViz(keyboardState: KeyboardState) {
  console.clear();
  type Item = [number, number]
  const array: Item[] = [];

  for (let pitch = MidiRange.MIN; pitch <= MidiRange.MAX; pitch++) {
    const message = keyboardState[pitch]
    if (!message) {
      array[pitch] = [pitch, 0];
    } else {
      array[pitch] = [pitch, message[0] === MidiMessageStatus.NOTE_ON ? message[2] : 0];

    }
  }
  console.log(babar(array, {
    grid: 'blue',
    maxY: MidiRange.MAX,
    minY: MidiRange.MIN,
    width: 259,
    height: 70,
  }))
}
