import testOutput from './testers/testOutput';
import testInput from './testers/testInput';
import testMidiFile from './testers/testMidiFile';
import testFilter from './testers/testFilter';
import kEyQ from './filters/kEyQ';
import pianoCalibration, { RANI_PIANO_CALIBRATION } from './filters/pianoCalibration';
import { playTester } from './players/playTester';
import { playFile } from './players/playFile';
import { playInput } from './players/playInput';
import { PianoRange } from './utils/const';

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
  // testFilter(pianoCalibration, { calibration: RANI_PIANO_CALIBRATION }, 10);
})();
