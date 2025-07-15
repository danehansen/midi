import testOutput from './testers/testOutput';
import testInput from './testers/testInput';
import testMidiFile from './testers/testMidiFile';
import testFilter from './testers/testFilter';
import kEyQ from './handlers/filters/kEyQ';
import { playTester } from './players/playTester';
import { playFile } from './players/playFile';
import { playInput } from './players/playInput';
import { PianoRange } from './utils/const';
import pianoCalibration, { RANI_PIANO_CALIBRATION } from './handlers/filters/pianoCalibration';

(async function () {
  // playTester();
  playInput();
  // playFile('./mid/the_entertainer.mid');

  // testInput();
  // testOutput();
  // testMidiFile();

  // testFilter(kEyQ, {
  //   lowPass: PianoRange.MAX,
  //   highPass: PianoRange.MIN,
  // }, 127);
  // testFilter(pianoCalibration, RANI_PIANO_CALIBRATION, 1);
})();
