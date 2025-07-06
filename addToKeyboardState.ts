import { MidiMessage } from "midi";
import { KeyboardState } from "./types";

export default function addToKeyboardState(messages: MidiMessage[] = [], keyboardState: KeyboardState = {}): KeyboardState {
  let result: KeyboardState = { ...keyboardState };
  let hasMadeChange = false;
  messages.forEach((message) => {
    const [status, pitch, velocity] = message;
    const storedItem = result[pitch];
    if (storedItem?.[0] !== status || storedItem?.[2] !== velocity) {
      hasMadeChange = true;
      result[pitch] = message;
    }
  })
  if (hasMadeChange) {
    return result;
  }
  return keyboardState;
}