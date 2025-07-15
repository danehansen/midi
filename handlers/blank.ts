import { MidiMessage } from "midi";
import { StatefulMessageHandler, MessageHandler } from ".";

const blank: StatefulMessageHandler = (message: MidiMessage, callback: MessageHandler): void => {
  callback(message)
}

export default blank;