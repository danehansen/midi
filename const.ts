import { Pitch, Velocity } from "./types";

export const OCTAVE_SIZE = 12;
export const MIDI_SIZE = Math.pow(2, 7); // 128

export const enum MidiRange {
  LOW = 0,
  HIGH = 127, // MIDI_SIZE - 1
}

export const enum ChannelRange {
  LOW = 1,
  HIGH = 16,
}

export const enum PianoRange {
  LOW = 21,
  HIGH = PianoRange.LOW + 88 - 1, // 108
}

export const enum MidiMessageStatus {
  NOTE_OFF = 0x80, // 128
  NOTE_ON = 0x90, // 144
  POLYPHONIC_AFTERTOUCH = 0xA0, // 160
  CONTROL_CHANGE = 0xB0, // 176
  PROGRAM_CHANGE = 0xC0, // 192
  CHANNEL_AFTERTOUCH = 0xD0, // 208
  PITCH_WHEEL = 0xE0, // 224
}


// TODO: get length of 2.5mm extension needed
// TODO: get details on ~10v? power supply
export const RANI_PIANO_CALIBRATION: Record<Pitch, Velocity> = { // act as velocity 0 for this pitch
  // 21: MidiRange.HIGH, // A0
  // 22: MidiRange.HIGH, // A#0
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
  // 39: MidiRange.HIGH, // D#2

  // 40: MidiRange.HIGH, // E2
  // 41: MidiRange.HIGH, // F2
  // 42: MidiRange.HIGH, // F#2
  // 43: MidiRange.HIGH, // G2
  // 44: MidiRange.HIGH, // G#2
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
  // 106: MidiRange.HIGH, // A#7
  // 107: MidiRange.HIGH, // B7
  // 108: MidiRange.HIGH, // C8
}