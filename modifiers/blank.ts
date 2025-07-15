import { MidiMessage } from "midi";
import { Modifier, ModifierCallback } from ".";

const blank: Modifier = (message: MidiMessage, callback: ModifierCallback): void => {
  callback(message)
}

export default blank;