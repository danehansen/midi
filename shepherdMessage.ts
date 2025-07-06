import { MidiMessage } from "midi";
import { MidiMessageStatus, MidiRange, PianoRange } from "./const";
import getOctavesOfPitch from "./getOctavesOfPitch";
import { Pitch, Velocities, Velocity, VelocityOptions } from "./types";
import * as eases from "./eases";
import getNormalized from "./getNormalized";

export default function shepherdMessage(
  message: MidiMessage, // native midi message
  velocities: Velocities = {},
  retrigger?: boolean, // if im already holding down C1, and i hit C2, should the Cs retrigger? or just stay down? needs better naming
  options: VelocityOptions = {},
) {
  const [status, pitch, velocity] = message;
  switch (status) {
    case MidiMessageStatus.NOTE_ON:
    case MidiMessageStatus.NOTE_OFF: {
      const noteNums = getOctavesOfPitch(pitch);
      let newMessages: MidiMessage[] = [];
      let newVelocities: Velocities;

      if (status === MidiMessageStatus.NOTE_ON || velocity === 0) {
        newVelocities = { ...velocities, [pitch]: velocity }

        const isAlreadyPlayed = noteNums.some((noteNum) => {
          typeof newVelocities[noteNum] === 'number';
        })

        if (retrigger || !isAlreadyPlayed) {
          newMessages = noteNums.map((pitch) => {
            return [
              MidiMessageStatus.NOTE_ON,
              pitch,
              getVelocity(velocity, pitch, options),
            ] as MidiMessage
          })
        } else {
          newMessages = [];
        }
      } else {
        const { [pitch]: offNote, ...onNotes } = velocities
        newVelocities = onNotes

        const noteNums = getOctavesOfPitch(pitch);

        const remainingNotes = noteNums.filter((noteNum) => (newVelocities[noteNum] || 0) > 0)
        if (!remainingNotes.length) {
          newMessages = noteNums.map((pitch) => {
            return [
              MidiMessageStatus.NOTE_OFF,
              0,
              pitch,
            ] as MidiMessage
          })
        }
      }

      return {
        messages: newMessages,
        velocities: newVelocities,
      };
    }
    default:
      return {
        messages: [message],
        velocities,
      }
  }
}

function getVelocity(velocity: Velocity, pitch: Pitch, {
  maxVelocity = MidiRange.HIGH,
  minVelocity = MidiRange.LOW,
  ease = eases.inCubic,
  highPass = PianoRange.LOW,
  lowPass = PianoRange.HIGH,
  taper = 1,
  pianoCalibration,
}: VelocityOptions = {}): Velocity {
  let v: number = velocity;

  if (pitch < highPass || pitch > lowPass) {
    return MidiRange.LOW;
  }
  const n = getNormalized(MidiRange.LOW, MidiRange.HIGH, v);
  const diff = maxVelocity - minVelocity;
  const amount = diff * n;
  v = minVelocity + amount;

  const newDiff = v - minVelocity;
  const normalizeVelocitydPitch = getNormalized(highPass - 1, lowPass + 1, pitch); // range expanded by 1 on each end so that the highest/lowest notes are not wastest as velocity 0
  const taperIn = taper / 2
  const taperOut = 1 - taperIn;
  if (normalizeVelocitydPitch < taperIn) {
    v = ease(normalizeVelocitydPitch / taperIn);
    v *= newDiff;
    v += minVelocity;
  } else if (normalizeVelocitydPitch > taperOut) {
    v = ease((1 - normalizeVelocitydPitch) / taperIn);
    v *= newDiff;
    v += minVelocity;
  }
  const calVel = pianoCalibration?.[pitch]
  if (calVel) {
    const calN = getNormalized(calVel, MidiRange.HIGH, v);
    const calDiff = MidiRange.HIGH - calVel
    v = calVel + calDiff * calN
  }

  return Math.round(v);
}