import { MidiMessage } from "midi";
import { MidiMessageStatus } from "../utils/const";
import getOctavesOfPitch from "../utils/getOctavesOfPitch";
import { KeyboardState } from "../utils/types";
import isMidiMessageOn from "../utils/isMidiMessageOn";
import { getTransformModifier, ModifierCallback } from "../utils/modifiers";

export default function shepardizeMidiMessage(
  inMessage: MidiMessage,
  inState: KeyboardState,
) {
  const [status, pitch, velocity] = inMessage;
  if (status !== MidiMessageStatus.NOTE_ON && status !== MidiMessageStatus.NOTE_OFF) {
    return [inMessage];
  }
  const isOn = isMidiMessageOn(inMessage);
  const pitches = getOctavesOfPitch(pitch);
  if (isOn) {
    return pitches.map((pitch) => {
      return [
        MidiMessageStatus.NOTE_ON,
        pitch,
        velocity,
      ] as MidiMessage
    })
  } else {
    const { [pitch]: offMessage, ...onMessages } = inState
    const allOff = !pitches.some((pitch) => isMidiMessageOn(onMessages[pitch]));
    if (allOff) {
      return pitches.map((pitch) => {
        return [
          MidiMessageStatus.NOTE_OFF,
          pitch,
          0,
        ] as MidiMessage
      })
    }
    return [];
  }
}

export function shepardizeModifier(callback: ModifierCallback) {
  return getTransformModifier(callback, shepardizeMidiMessage);
}
