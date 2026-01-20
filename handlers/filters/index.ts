import { MidiMessage } from "midi";

export interface Filter { (message: MidiMessage, options?: {}): MidiMessage; }