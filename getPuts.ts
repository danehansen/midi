import JZZ from 'jzz';
import midi, { MidiMessage } from 'midi';
import killAll from './killAll';

// TODO: fallbackToVirtual
export async function getOutput(name?: string, fallbackToVirtual?: boolean) {
  if (name) {
    const output = new midi.Output();
    output.openPort(getPortNumber(name, output));
    killAll(output);
    return {
      sendMessage(m) {
        output.sendMessage(m);
      },
      closePort() {
        killAll(output);
        output.closePort();
      }
    } as midi.Output
  } else {
    const jzz = await JZZ()
      .or('Cannot start MIDI engine!')
      .openMidiOut()
      .or('Cannot open MIDI Out port!')

    return {
      jzz,
      sendMessage(m: MidiMessage) {
        jzz.send(m)
          .or('problem sending')
      },
      closePort() {
        jzz.close();
      }
    } as unknown as midi.Output
  }
}

export function getInput(name?: string) {
  if (name) {
    const input = new midi.Input();
    input.openPort(getPortNumber(name, input));
    return input;
  } else {
    throw new Error('TODO')
  }
}

function getPortNumber(str: string, put: midi.Output | midi.Input): number {
  const count = put.getPortCount();
  if (!count) {
    throw new Error(`no ports found.`)
  }
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const name = put.getPortName(i)
    if (name === str) {
      return i;
    }
    names.push(name);
  }
  throw new Error(`no port found named ${str}. only these: ${names}`)
}