import { MidiMessage } from 'midi';
import { MidiMessageStatus } from './const';
import addToKeyboardState from './addToKeyboardState';
import dataViz from './dataViz';
import { getOutput } from './getPuts';
import JZZ from 'jzz';
import SMF from 'jzz-midi-smf';
import { readFile } from 'fs/promises';
import killAll from './killAll';

SMF(JZZ);

const OUTPUT_NAME = 'WIDI green Bluetooth';
// const OUTPUT_NAME = 'WIDI orange Bluetooth';

// const FILE_NAME = './happy_birthday.mid';
// const FILE_NAME = './happy_birthday_poly.mid';
const FILE_NAME = './the_entertainer.mid';
// https://www.conversion-tool.com/audiotomidi/
// const FILE_NAME = './take_on_me.mid';

export default async function midiFileTest() {
  let dead = false;
  const output = await getOutput(OUTPUT_NAME, true);
  const data = await readFile(FILE_NAME, 'binary');
  const smf = new (JZZ.MIDI as MidiConstructor).SMF(data);
  const player = smf.player();
  let outputState = addToKeyboardState();

  // player.connect(output.jzz);

  player.connect({
    send(m: MidiMessage) {
      const [status] = m;
      if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
        output.sendMessage(m);
      }
    }
  });

  player.connect((m: MidiMessage) => {
    const [status] = m;
    if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
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

type Constructor = (typeof JZZ.MIDI)
interface MidiConstructor extends Constructor {
  SMF: Function | { MTrk: Function } | any
}
