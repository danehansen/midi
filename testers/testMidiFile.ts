import { MidiMessage } from 'midi';
import { MidiMessageStatus } from '../utils/const';
import dataViz from '../utils/dataViz';
import { getOutput } from '../utils/getPorts';
import JZZ from 'jzz';
import SMF from 'jzz-midi-smf';
import { readFile } from 'fs/promises';
import killAll from '../utils/killAll';
import { KeyboardState, MidiConstructor } from '../utils/types';

SMF(JZZ);

const OUTPUT_NAME = 'WIDI orange Bluetooth';

// const FILE_NAME = './mid/happy_birthday.mid';
// const FILE_NAME = './mid/happy_birthday_poly.mid';
// const FILE_NAME = './mid/the_entertainer.mid';
// https://www.conversion-tool.com/audiotomidi/
const FILE_NAME = './mid/take_on_me.mid';

export default async function testMidiFile() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const data = await readFile(FILE_NAME, 'binary');
  const smf = new (JZZ.MIDI as MidiConstructor).SMF(data);
  const player = smf.player();
  let outputState: KeyboardState = {};

  player.connect({
    send([status, pitch, velocity]: MidiMessage) {
      if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
        output.sendMessage([status, pitch, velocity]);
      }
    }
  });

  player.connect(([status, pitch, velocity]: MidiMessage) => {
    if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
      outputState[pitch] = [status, pitch, velocity];
      dataViz(outputState);
    }
  });

  player.play();
  console.log('playing...');
  process.on('SIGINT', destroy);

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    player.stop();
    player.disconnect();
    killAll(output);
    console.log('closing output...')
    output.closePort();
    process.exitCode = 0;
  }
}
