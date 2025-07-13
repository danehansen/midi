import { MidiMessage } from "midi";
import { ModifierCallback } from ".";
import { KeyboardState } from "../utils/types";
import { MidiMessageStatus, MidiRange } from "../utils/const";
import { getPitch, getStatus, getVelocity } from "../utils/getMessageProps";

const DELAY = 80;
const DECAY = 0.8;
const DIRECTION = 1;
export default function ascend(message: MidiMessage, callback: ModifierCallback, preexistingState?: KeyboardState) {
  callback(message);
  const status = getStatus(message);
  if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
    const pitch = getPitch(message);
    let velocity = getVelocity(message);
    for (let i = 0; i < 20; i++) {
      let v = velocity;
      let p = pitch;
      for (let j = 0; j < i; j++) {
        v *= DECAY;
        p += DIRECTION;
      }
      const d = DELAY * i;
      v = Math.round(v);
      if (v && p <= MidiRange.MAX) {
        setTimeout(() => {
          callback([status, p, v]);
        }, d);
      }
    }
  }
}
