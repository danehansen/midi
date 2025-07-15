import { MidiMessage } from "midi";

export type Filter = (message: MidiMessage, options?: any) => MidiMessage;