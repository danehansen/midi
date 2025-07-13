import { MidiMessage } from "midi";
import { Filter, KeyboardState, Transformer } from "./types";
import { getPitch, getStatus, getVelocity } from "./getMessageProps";
import { MidiMessageStatus, MidiRange } from "./const";

export type ModifierCallback = (message: MidiMessage) => ModifierCallback | void;
export type Modifier = (message: MidiMessage, callback: ModifierCallback, preexistingState: KeyboardState) => void;

export function getTransformModifier(callback: ModifierCallback, transformer: Transformer) {
  const inState: KeyboardState = {};
  return (message: MidiMessage) => {
    const pitch = getPitch(message);
    const modifiedMessages = transformer(message, inState);
    inState[pitch] = message;
    modifiedMessages.forEach((modifiedMessage) => {
      callback(modifiedMessage);
    })
  }
}

export function getFilterModifier(callback: ModifierCallback, filter: Filter) {
  const inState: KeyboardState = {};
  return (message: MidiMessage) => {
    const pitch = getPitch(message);
    const alteredMessage = filter(message);
    inState[pitch] = message;
    callback(alteredMessage);
  }
}

const ECHO_DELAY = 500;
const ECHO_DECAY = 0.5;
export function echo(message: MidiMessage, callback: ModifierCallback, preexistingState?: KeyboardState) {
  callback(message);
  const status = getStatus(message);
  if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
    const pitch = getPitch(message);
    let velocity = getVelocity(message);
    for (let i = 0; i < 20; i++) {
      let v = velocity;
      for (let j = 0; j < i; j++) {
        v *= ECHO_DECAY;
      }
      const delay = ECHO_DELAY * i;
      v = Math.round(v);
      if (v) {
        setTimeout(() => {
          callback([status, pitch, v]);
        }, delay);
      }
    }
  }
}

const ASCEND_DELAY = 80;
const ASCEND_DECAY = 0.8;
const DIRECTION = 1;
export function ascend(message: MidiMessage, callback: ModifierCallback, preexistingState?: KeyboardState) {
  callback(message);
  const status = getStatus(message);
  if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
    const pitch = getPitch(message);
    let velocity = getVelocity(message);
    for (let i = 0; i < 20; i++) {
      let v = velocity;
      let p = pitch;
      for (let j = 0; j < i; j++) {
        v *= ASCEND_DECAY;
        p += DIRECTION;
      }
      const d = ASCEND_DELAY * i;
      v = Math.round(v);
      if (v && p <= MidiRange.MAX) {
        setTimeout(() => {
          callback([status, p, v]);
        }, d);
      }
    }
  }
}
