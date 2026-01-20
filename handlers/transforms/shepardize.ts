import { MidiMessageStatus } from "../../utils/const";
import getOctavesOfPitch from "../../utils/getOctavesOfPitch";
import isMidiMessageOn from "../../utils/isMidiMessageOn";
import { Transformer } from "../transforms";

const shepardize: Transformer = (
  inMessage,
  inState,
) => {
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
      ]
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
        ]
      })
    }
    return [];
  }
}

export default shepardize;