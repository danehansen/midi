import { MidiMessage } from "midi";
import { MidiMessageStatus, PianoRange } from "../utils/const";
import { KeyboardState, Pitch } from "../utils/types";
import isMidiMessageOn from "../utils/isMidiMessageOn";
import getOctavesOfPitch from "../utils/getOctavesOfPitch";
import math from '@danehansen/math';
import { getTransformModifier, ModifierCallback } from "../utils/modifiers";

const pitchMapping: Record<Pitch, Pitch> = {}
type Options = { lowPass?: number; highPass?: number };

export default function randomizeOctave(
  message: MidiMessage,
  inputState: KeyboardState,
  {
    lowPass = PianoRange.MAX,
    highPass = PianoRange.MIN,
  }: Options = {}) {
  const [status, pitch, velocity] = message;
  if (status !== MidiMessageStatus.NOTE_ON && status !== MidiMessageStatus.NOTE_OFF) {
    return [message]
  }
  const isOn = isMidiMessageOn(message);

  let alteredMessage: MidiMessage;

  if (isOn) {
    const octaves = getOctavesOfPitch(pitch).filter((p) => {
      return !pitchMapping[p] && p >= highPass && p <= lowPass;
    })
    const randomPitch = math.randomItem(octaves)
    pitchMapping[pitch] = randomPitch;
    alteredMessage = [status, randomPitch, velocity];
  } else {
    let mappedPitch = pitchMapping[pitch];
    if (typeof mappedPitch !== 'number') {
      console.warn(`mappedPitch not found`, { pitchMapping, pitch })
      mappedPitch = pitch;
    }
    alteredMessage = [status, mappedPitch, velocity];
    delete pitchMapping[pitch];
  }

  return [alteredMessage]
}

export function randomizeOctaveModifier(callback: ModifierCallback) {
  return getTransformModifier(callback, randomizeOctave);
}
