import { MidiMessage } from "midi";
import { UnnamedB, MessageHandler } from ".";

const blank: UnnamedB = (message: MidiMessage, callback: MessageHandler): void => {
  callback(message)
}

export default blank;