import { MidiMessage } from "midi";
import JZZ from 'jzz';

export type Channel = number; // int ChannelRange.MIN - ChannelRange.MAX
export type Pitch = number; // int MidiRange.MIN - MidiRange.MAX
export type Velocity = number; // int MidiRange.MIN - MidiRange.MAX, 0 = absence of volume, 1 = lowest possible audible volume
export type Taper = number; // 0-1, possibly not the best term/usage since it actually represents double what the number does

export type KeyboardState = Record<Pitch, MidiMessage | undefined>;
export type Transformer = (message: MidiMessage, preexistingState: KeyboardState, options?: any) => MidiMessage[];
export type Filter = (message: MidiMessage, options?: any) => MidiMessage;

type Constructor = (typeof JZZ.MIDI);
export interface MidiConstructor extends Constructor {
  SMF: Function | { MTrk: Function } | any
}