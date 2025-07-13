import { MidiMessage } from "midi";

export function getVelocity([, , velocity]: MidiMessage): number {
  return velocity;
}

export function getPitch([, pitch]: MidiMessage): number {
  return pitch;
}

export function getStatus([status]: MidiMessage): number {
  return status;
}