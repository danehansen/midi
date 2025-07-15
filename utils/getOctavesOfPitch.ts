import { MidiRange, OCTAVE_SIZE } from "./const";
import { Pitch } from "./types";

// result length full range: 10-11, piano range: 7-8
export default function getOctavesOfPitch(pitch: Pitch): Pitch[] {
  const lowestNote = pitch % OCTAVE_SIZE;
  const pitchs: Pitch[] = [];
  for (let i = lowestNote; i <= MidiRange.MAX; i += OCTAVE_SIZE) {
    pitchs.push(i);
  }
  return pitchs;
}

export function getMajorChordOfNote(pitch: Pitch): Pitch[] {
  const pitchs: Pitch[] = [pitch, pitch + 4, pitch + 7];
  return pitchs;
}

export function getMinorChordOfNote(pitch: Pitch): Pitch[] {
  const pitchs: Pitch[] = [pitch, pitch + 3, pitch + 7];
  return pitchs;
}