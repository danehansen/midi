export const OCTAVE_SIZE = 12;

export const enum MidiRange {
  MIN = 0,
  MAX = 127,
}

export const enum ChannelRange {
  MIN = 1,
  MAX = 16,
}

export const enum PianoRange {
  MIN = 21,
  MAX = 108, // PianoRange.MIN + 88 keys - 1
}

export const enum MidiMessageStatus {
  NOTE_OFF = 128, // 0x80
  NOTE_ON = 144, // 0x90
  POLYPHONIC_AFTERTOUCH = 160, // 0xA0
  CONTROL_CHANGE = 176, // 0xB0
  PROGRAM_CHANGE = 192, // 0xC0
  CHANNEL_AFTERTOUCH = 208, // 0xD0
  PITCH_WHEEL = 224, // 0xE0
}

export const MidiMessageStatusMap = {
  [MidiMessageStatus.NOTE_OFF]: 'NOTE_OFF',
  [MidiMessageStatus.NOTE_ON]: 'NOTE_ON',
  [MidiMessageStatus.POLYPHONIC_AFTERTOUCH]: 'POLYPHONIC_AFTERTOUCH',
  [MidiMessageStatus.CONTROL_CHANGE]: 'CONTROL_CHANGE',
  [MidiMessageStatus.PROGRAM_CHANGE]: 'PROGRAM_CHANGE',
  [MidiMessageStatus.CHANNEL_AFTERTOUCH]: 'CHANNEL_AFTERTOUCH',
  [MidiMessageStatus.PITCH_WHEEL]: 'PITCH_WHEEL',
}