import { MidiMessage } from "midi";
import { MidiConstructor } from "../utils/types";
import { getStatus } from "../utils/getMessageProps";
import { getOutput } from "../utils/getPorts";
import killAll from "../utils/killAll";
import { readFile } from 'fs/promises';
import JZZ from 'jzz';
import SMF from 'jzz-midi-smf';
import { MidiMessageStatus } from "../utils/const";
import { getPianoCalibrationHandler, getKEyQHandler, getShepardizeHandler, getRandomizeOctaveHandler } from '../handlers/index'
import sleep from "../utils/sleep";
import echo from "../handlers/echo";
import ascend from "../handlers/ascend";
import { Queue } from "../utils/queue";

SMF(JZZ);

export async function playFile(outputName: string, midiFile: string): Promise<void> {
  let dead = false;
  const output = await getOutput(outputName, true);
  const queue = new Queue(output.sendMessage)

  const modifierLast = getKEyQHandler(finalCallback);
  // const modifierSecond = getPianoCalibrationHandler(modifierLast);
  // const modifierFirst = getShepardizeHandler(modifierLast);
  // const modifierFirst = getRandomizeOctaveHandler(modifierLast);
  const modifierFirst = getRandomizeOctaveHandler(modifierLast);

  const smf = new (JZZ.MIDI as MidiConstructor).SMF(await readFile(midiFile, 'binary'));
  const player = smf.player();
  player.connect({ send });
  player.play();
  console.log('playing...');
  process.on('SIGINT', destroy);

  function send(message: MidiMessage) {
    const status = getStatus(message);
    if (status === MidiMessageStatus.NOTE_ON || status === MidiMessageStatus.NOTE_OFF) {
      // modifierFirst(message);
      // echo(message, modifierLast);
      ascend(message, modifierLast);
    }
  }

  function finalCallback(m: MidiMessage) {
    queue.insertMessage(m);
    queue.vizualize();
  }

  function destroy() {
    if (dead) {
      return;
    }
    dead = true;
    queue.kill();
    player.stop();
    player.disconnect();
    killAll(output);
    console.log('closing output...')
    output.closePort();
    process.exitCode = 0;
  }
}
