import { MidiMessage } from 'midi';
import { MidiMessageStatus } from './const';
import addToKeyboardState from './addToKeyboardState';
import dataViz from './dataViz';
import { getOutput } from './getPuts';
import JZZ from 'jzz';
import SMF from 'jzz-midi-smf';
import { readFile } from 'fs/promises';
import killAll from './killAll';

const OUTPUT_NAME = 'WIDI green Bluetooth';
// const OUTPUT_NAME = 'WIDI orange Bluetooth';

// const FILE_NAME = './happy_birthday.mid';
// const FILE_NAME = './happy_birthday_poly.mid';
const FILE_NAME = './the_entertainer.mid';

SMF(JZZ);

export default async function midiFileTest() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const data = await readFile(FILE_NAME, 'binary');
  // @ts-expect-error
  const smf = new JZZ.MIDI.SMF(data);
  const player = smf.player();
  let outputState = addToKeyboardState();

  // player.connect(output.jzz);

  player.connect({
    send(m) {
      const [status, pitch, velocity] = m;
      if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
        output.sendMessage([status, pitch, velocity] as MidiMessage);
      }
    }
  });

  player.connect((m) => {
    const [status, pitch, velocity] = m;
    if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
      const m = [status, pitch, velocity] as MidiMessage;
      outputState = addToKeyboardState([m], outputState);
      dataViz(outputState);
    }
  });

  player.play();
  console.log('playing...');

  process.on('SIGINT', () => {
    dead = true;
    player.stop();
    killAll(output);
    output.closePort();
    process.exit(0);
  });
}
