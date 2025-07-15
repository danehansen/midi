import { MidiMessage } from "midi";
import { Pitch, Velocity } from "../../utils/types";
import math from '@danehansen/math';
import { MidiRange } from "../../utils/const";
import { Filter } from ".";

type CalibrationData = Record<Pitch, Velocity>

const pianoCalibration: Filter = ([status, pitch, velocity]: MidiMessage, calibrationData: CalibrationData = RANI_PIANO_CALIBRATION): MidiMessage => {
  let v: number = velocity;
  const calVel = calibrationData[pitch];
  if (calVel && calVel !== MidiRange.MAX) {
    const calDiff = MidiRange.MAX - calVel;
    const velN = math.normalize(MidiRange.MIN, MidiRange.MAX, velocity)
    v = calVel + calDiff * velN;
  } else {
    v = velocity;
  }

  const finalVelocity = Math.round(v)
  return [status, pitch, finalVelocity];
}

export default pianoCalibration;

export const RANI_PIANO_CALIBRATION: CalibrationData = { // act as velocity 0 for this pitch
  21: MidiRange.MAX, // A0
  22: MidiRange.MAX, // A#0
  23: 26, // B0
  24: 28, // C1
  25: 10,
  26: 33,
  27: 12,
  28: 24,
  29: 5,

  30: 15,
  31: 17,
  // 32: 0,
  // 33: 0, // A1
  34: 3, // A#1
  // 35: 0, // B2
  36: 8, // C2
  // 37: 0, // C#2
  38: 17, // D2
  // 39: MidiRange.MAX, // D#2

  40: MidiRange.MAX, // E2
  41: MidiRange.MAX, // F2
  42: MidiRange.MAX, // F#2
  43: MidiRange.MAX, // G2
  44: MidiRange.MAX, // G#2
  // 45: 0, // A2
  // 46: 0, // A#2
  // 47: 0, // B2
  48: 1, // C3
  49: 15,

  50: 19,
  51: 28,
  52: 33,
  53: 40,
  54: 9,
  55: 45, // G3
  56: 5, // G#3
  57: 40, // A3
  58: 12, // A#3
  59: 12, // B3

  60: 8, // C4
  61: 16,
  62: 16,
  63: 15,
  64: 13,
  65: 12,
  66: 4,
  67: 29, // G4
  68: 1, // G#4
  69: 45, // A4 440hz

  70: 5, // A#4
  71: 26, // B4
  72: 15, // C5
  73: 14,
  74: 9,
  75: 9,
  76: 5,
  77: 5,
  78: 9,
  79: 16, // G5

  80: 16, // G#5
  81: 18, // A5
  82: 5, // A#5
  83: 6, // B5
  84: 23, // C6
  85: 1,
  86: 9,
  87: 3,
  88: 30,
  89: 3,

  90: 15,
  91: 3, // G6
  92: 11, // G#6
  93: 20, // A6
  94: 20, // A#6
  95: 30, // B6
  96: 5, // C7
  97: 45,
  98: 10,
  99: 33,

  100: 17,
  101: 28,
  102: 8,
  103: 36, // G7
  104: 5, // G#7
  105: 23, // A7
  106: MidiRange.MAX, // A#7
  107: MidiRange.MAX, // B7
  108: MidiRange.MAX, // C8
}
