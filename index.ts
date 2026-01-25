import testOutput from './testers/testOutput';
import testInput from './testers/testInput';
import testMidiFile from './testers/testMidiFile';
import testFilter from './testers/testFilter';
import kEyQ from './handlers/filters/kEyQ';
import { playTester } from './players/playTester';
import { playFile } from './players/playFile';
import { playInput } from './players/playInput';
import { PianoRange, PortNames } from './utils/const';
import pianoCalibration, { RANI_PIANO_CALIBRATION } from './handlers/filters/pianoCalibration';
import { testSpeed } from './testers/testSpeed';

// https://www.conversion-tool.com/audiotomidi/

(async function () {
  const INPUT_NAME = PortNames.WC1;
  const OUTPUT_NAME = PortNames.GREEN;
  // const MIDI_NAME = './mid/the_entertainer.mid';
  // const MIDI_PATH = './mid/happy_birthday_poly.mid';
  const MIDI_PATH = './mid/happy_birthday.mid';
  // const MIDI_PATH = './mid/take_on_me.mid';

  // playTester(OUTPUT_NAME);
  // playInput(INPUT_NAME, OUTPUT_NAME);
  // playFile(OUTPUT_NAME, MIDI_PATH);

  // testInput(INPUT_NAME);
  // testOutput(OUTPUT_NAME);
  // testSpeed(OUTPUT_NAME);
  // testMidiFile(OUTPUT_NAME, MIDI_PATH);

  // testFilter(kEyQ, {
  //   lowPass: PianoRange.MAX,
  //   highPass: PianoRange.MIN,
  // }, 127);
  // testFilter(pianoCalibration, RANI_PIANO_CALIBRATION, 1);
})();
