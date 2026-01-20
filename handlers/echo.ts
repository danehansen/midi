import { MidiMessage } from "midi";
import { StatefulMessageHandler, MessageHandler } from ".";
import { MidiMessageStatus } from "../utils/const";
import { getPitch, getStatus, getVelocity } from "../utils/getMessageProps";
import getDecayedVelocities from "../utils/getDecayedVelocities";

const DELAY = 100;
const DECAY = 0.9;

const echo: StatefulMessageHandler = (message: MidiMessage, callback: MessageHandler): void => {
  callback(message);
  const status = getStatus(message);
  if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
    const pitch = getPitch(message);
    getDecayedVelocities(getVelocity(message), DECAY).forEach((velocity, i) => {
      setTimeout(() => {
        callback([status, pitch, velocity]);
      }, DELAY * (i + 1));
    });
  }
}

export default echo;
