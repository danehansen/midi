import { MidiMessage } from "midi";
import { Filter, KeyboardState, Transformer } from "../utils/types";
import { getPitch } from "../utils/getMessageProps";

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
