import { MidiMessage } from "midi";
import { MidiMessageStatus } from "./const";

export default function isMidiMessageOn(message?: MidiMessage): boolean {
  if (!message) {
    return false;
  }
  const [status, , velocity] = message;
  return status === MidiMessageStatus.NOTE_ON && velocity > 0;
}