import { MidiMessage } from "midi";
import { KeyboardState } from "../utils/types";
import { getPitch } from "../utils/getMessageProps";
import { Filter } from "./filters";
import { Transformer } from "./transforms";
import kEyQ from "./filters/kEyQ";
import pianoCalibration from "./filters/pianoCalibration";
import randomizeOctave from "./transforms/randomizeOctave";
import shepardize from "./transforms/shepardize";

export type MessageHandler = (message: MidiMessage) => void;
export type StatefulMessageHandler = (message: MidiMessage, callback: MessageHandler, preexistingState?: KeyboardState) => void;

function getTransformHandler(callback: MessageHandler, transformer: Transformer): MessageHandler {
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

function getFilterHandler(callback: MessageHandler, filter: Filter): MessageHandler {
  const inState: KeyboardState = {};
  return (message: MidiMessage): void => {
    const pitch = getPitch(message);
    const alteredMessage = filter(message);
    inState[pitch] = message;
    callback(alteredMessage);
  }
}

export function getKEyQHandler(callback: MessageHandler): MessageHandler {
  return getFilterHandler(callback, kEyQ);
}

export function getPianoCalibrationHandler(callback: MessageHandler): MessageHandler {
  return getFilterHandler(callback, pianoCalibration);
}

export function getRandomizeOctaveHandler(callback: MessageHandler): MessageHandler {
  return getTransformHandler(callback, randomizeOctave);
}

export function getShepardizeHandler(callback: MessageHandler): MessageHandler {
  return getTransformHandler(callback, shepardize);
}
