import { MidiMessage } from "midi";
import { ModifierCallback } from ".";
import { KeyboardState } from "../utils/types";
import { MidiMessageStatus, MidiRange } from "../utils/const";
import { getPitch, getStatus, getVelocity } from "../utils/getMessageProps";

const DELAY = 500;
const DECAY = 0.5;
export default function echo(message: MidiMessage, callback: ModifierCallback, preexistingState?: KeyboardState) {
  callback(message);
  const status = getStatus(message);
  if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
    const pitch = getPitch(message);
    let velocity = getVelocity(message);
    for (let i = 0; i < 20; i++) {
      let v = velocity;
      for (let j = 0; j < i; j++) {
        v *= DECAY;
      }
      const delay = DELAY * i;
      v = Math.round(v);
      if (v) {
        setTimeout(() => {
          callback([status, pitch, v]);
        }, delay);
      }
    }
  }
}
