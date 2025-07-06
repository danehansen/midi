import { Output } from "midi";
import { MidiMessageStatus, MidiRange } from "./const";

export default function killAll(output: Output): void {
  console.log('killAll');
  for (let pitch = MidiRange.LOW; pitch <= MidiRange.HIGH; pitch++) {
    output.sendMessage([MidiMessageStatus.NOTE_OFF, pitch, MidiRange.LOW]);
  }
}