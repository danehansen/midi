import { MidiMessage } from "midi";
import { KeyboardState } from "../utils/types";
import { getPitch } from "../utils/getMessageProps";
import { Filter } from "../filters";
import { Transformer } from "../transforms";

export type MessageHandler = (message: MidiMessage) => void;
export type UnnamedB = (message: MidiMessage, callback: MessageHandler, preexistingState?: KeyboardState) => void;

export function getTransformHandler(callback: MessageHandler, transformer: Transformer): MessageHandler {
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

export function getFilterHandler(callback: MessageHandler, filter: Filter): MessageHandler {
  const inState: KeyboardState = {};
  return (message: MidiMessage): void => {
    const pitch = getPitch(message);
    const alteredMessage = filter(message);
    inState[pitch] = message;
    callback(alteredMessage);
  }
}
