import { Output } from "midi";
import { MidiMessageStatus, MidiRange } from "../const";

export default function killAll(output: Output): void {
  console.log('killAll');
  for (let pitch = MidiRange.MIN; pitch <= MidiRange.MAX; pitch++) {
    output.sendMessage([MidiMessageStatus.NOTE_OFF, pitch, MidiRange.MIN]);
  }
}