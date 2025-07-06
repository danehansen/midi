import { MidiMessage } from "midi";
import addToKeyboardState from "./addToKeyboardState";
import { getOutput } from "./getPuts";
import { MidiMessageStatus, MidiRange, PianoRange, RANI_PIANO_CALIBRATION } from "./const";
import sleep from "./sleep";
import killAll from "./killAll";
import getNormalized from "./getNormalized";

const DURATION = 100;
const SKIP_BROKEN_PITCHES = true;

const CALIBRATION = RANI_PIANO_CALIBRATION;
// const CALIBRATION = undefined;

// const TARGET_VELOCITY = Math.round(MidiRange.HIGH * 0.5);
const TARGET_VELOCITY = 1;

const OUTPUT_NAME = 'WIDI green Bluetooth';
// const OUTPUT_NAME = 'WIDI orange Bluetooth';

export default async function calibratePiano() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  let inputState = addToKeyboardState();
  let currentPromise: Promise<any>;

  currentPromise = noteOn();

  async function noteOn(pitch: number = PianoRange.LOW) {
    const calVel = CALIBRATION[pitch] || 0;
    if (calVel !== MidiRange.HIGH || !SKIP_BROKEN_PITCHES) {

      const normalizedTarget = getNormalized(MidiRange.LOW, MidiRange.HIGH, TARGET_VELOCITY); // 0-1
      const range = MidiRange.HIGH - calVel;
      const amount = range * normalizedTarget;
      const velocity = Math.round(calVel + amount);
      let message: MidiMessage = [MidiMessageStatus.NOTE_ON, pitch, velocity];
      console.log({ pitch, velocity, message })
      output.sendMessage(message);
      inputState = addToKeyboardState([message], inputState);
      await sleep(DURATION);
      if (dead) {
        return;
      }
      message = [MidiMessageStatus.NOTE_OFF, pitch, MidiRange.LOW]
      output.sendMessage(message);
      inputState = addToKeyboardState([message], inputState);
    }

    pitch++;
    if (pitch > PianoRange.HIGH) {
      pitch = PianoRange.LOW;
    }
    if (!dead) {
      currentPromise = noteOn(pitch);
    }
  }

  process.on('SIGINT', async () => {
    dead = true;
    killAll(output);
    output.closePort();
    await currentPromise;
    process.exit(0);
  });
}