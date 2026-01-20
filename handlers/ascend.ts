import { StatefulMessageHandler } from ".";
import { MidiMessageStatus, MidiRange } from "../utils/const";
import { Range } from "../utils/types";
import { getPitch, getStatus, getVelocity } from "../utils/getMessageProps";
import getDecayedVelocities from "../utils/getDecayedVelocities";

const DELAY = 50;
const DECAY = 0.8;
const DIRECTION = 1;
const STEP = 1;

const ascend: StatefulMessageHandler = (message, callback) => {
  callback(message);
  const status = getStatus(message);
  if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
    const startingPitch = getPitch(message);
    const startingVelocity = getVelocity(message);
    const pitches = getDecayedPitches(startingPitch, DIRECTION, STEP);
    const velocities = getDecayedVelocities(startingVelocity, DECAY);
    const length = Math.min(pitches.length, velocities.length);
    for (let i = 0; i < length; i++) {
      setTimeout(() => {
        callback([status, pitches[i], velocities[i]]);
      }, DELAY * (i + 1));
    }
  }
}

export default ascend;

function getDecayedPitches(start: number, direction: number, step: number, range: Range = MidiRange): number[] {
  const pitches: number[] = [];
  let i = 1;
  while (_getPitch(start, direction, step, i) >= range.MIN && _getPitch(start, direction, step, i) <= range.MAX) {
    pitches.push(_getPitch(start, direction, step, i));
    i++;
  }
  return pitches;
}

const _getPitch = (start: number, direction: number, step: number, iterations: number) => start + direction * step * iterations;