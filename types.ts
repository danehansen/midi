import { MidiMessage } from "midi";
import { Ease } from "./eases";

export type Taper = number; // 0-1
export type Channel = number; // int ChannelRange.LOW - ChannelRange.HIGH
export type Pitch = number; // int MidiRange.LOW - MidiRange.HIGH
export type Velocity = number; // int MidiRange.LOW - MidiRange.HIGH, 0 = absence of volume
export type Velocities = Record<Pitch, Velocity>;

export type VelocityOptions = {
  ease?: Ease; // equation apllied to the taper
  taper?: Taper; // how much does the tapered range take up? 0-1
  lowPass?: Pitch; // leave out pitches = 109-127 for 88 key piano
  highPass?: Pitch; // leave out pitches = 0-20 for 88 key piano
  maxVelocity?: Velocity; // volume cap
  minVelocity?: Velocity; // volume floor
  pianoCalibration?: Record<Pitch, Velocity>;
}

export type NoteHandler = (channel: Channel, pitch: Pitch, velocity: Velocity) => void; // both on and off

export type KeyboardState = Record<Pitch, MidiMessage | undefined>