import { MidiMessage } from "midi";
import addToKeyboardState from "./addToKeyboardState";
import { getOutput } from "./getPuts";
import { MidiMessageStatus, MidiRange, PianoRange, RANI_PIANO_CALIBRATION } from "./const";
import sleep from "./sleep";
import killAll from "./killAll";

const DURATION = 500;
const CALIBRATION = RANI_PIANO_CALIBRATION;
// const CALIBRATION = undefined;

// const OUTPUT_NAME = 'WIDI green Bluetooth';
// const OUTPUT_NAME = 'WIDI orange Bluetooth';
const OUTPUT_NAME = undefined;

export default async function calibratePiano() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME);
  let inputState = addToKeyboardState();
  let currentPromise: Promise<any>;

  currentPromise = noteOn();

  async function noteOn(pitch: number = PianoRange.LOW) {
    const velocity = CALIBRATION[pitch];
    let message: MidiMessage = [MidiMessageStatus.NOTE_ON, pitch, velocity];
    console.log({ pitch, velocity })
    output.sendMessage(message);
    inputState = addToKeyboardState([message], inputState);
    await sleep(DURATION);
    if (dead) {
      return;
    }
    message = [MidiMessageStatus.NOTE_OFF, pitch, MidiRange.LOW]
    output.sendMessage(message);
    inputState = addToKeyboardState([message], inputState);

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