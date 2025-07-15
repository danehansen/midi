import { MidiMessage } from "midi";
import { KeyboardState } from "../utils/types";
import { getPitch } from "../utils/getMessageProps";
import { Filter } from "../filters";
import { Transformer } from "../transforms";

// earlier in chain:
// (m: MidiMessage, callback: Function, state?: KeyboardState) => void

// final in chain:
// (m:MidiMessage)=>void // playing the note

export type ModifierCallback = (message: MidiMessage) => ModifierCallback | void;
export type Modifier = (message: MidiMessage, callback: ModifierCallback, preexistingState: KeyboardState) => void;

export function getTransformModifier(callback: ModifierCallback, transformer: Transformer): Modifier {
  const inState: KeyboardState = {};
  return (message: MidiMessage): void => {
    const pitch = getPitch(message);
    const modifiedMessages = transformer(message, inState);
    inState[pitch] = message;
    modifiedMessages.forEach((modifiedMessage) => {
      callback(modifiedMessage);
    })
  }
}

export function getFilterModifier(callback: ModifierCallback, filter: Filter): Modifier {
  const inState: KeyboardState = {};
  return (message: MidiMessage): void => {
    const pitch = getPitch(message);
    const alteredMessage = filter(message);
    inState[pitch] = message;
    callback(alteredMessage);
  }
}
