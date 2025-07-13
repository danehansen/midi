import JZZ from 'jzz';
import midi, { MidiMessage } from 'midi';
import killAll from './killAll';

async function makeVirtualOutput(): Promise<midi.Output> {
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

async function makeVirtualInput(): Promise<midi.Input> {
  // throw new Error('TODO: makeVirtualInput');
  const jzz = await JZZ()
    .or('Cannot start MIDI engine!')
    .openMidiIn()
    .or('Cannot open MIDI In port!')

  return {
    jzz,
    sendMessage(m: MidiMessage) {
      jzz.send(m)
        .or('problem sending')
    },
    closePort() {
      jzz.close();
    }
  } as unknown as midi.Input
}

function getPortNumber(str: string, put: midi.Output | midi.Input): number | string {
  const count = put.getPortCount();
  if (!count) {
    return "no ports found.";
  }
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const name = put.getPortName(i)
    if (name === str) {
      return i;
    }
    names.push(name);
  }
  return `no port found named ${str}. only these: ${names}`
}

export async function getOutput(name?: string, fallbackToVirtual?: boolean): Promise<midi.Output> {
  if (name) {
    const output = new midi.Output();
    const portNumber: number | string = getPortNumber(name, output);

    if (typeof portNumber === 'string') {
      if (fallbackToVirtual) {
        console.warn(portNumber);
        return await makeVirtualOutput();
      }
      throw new Error(portNumber);
    }

    output.openPort(portNumber);
    killAll(output);

    return {
      sendMessage(m: MidiMessage) {
        output.sendMessage(m);
      },
      closePort() {
        killAll(output);
        output.closePort();
      },
    } as midi.Output
  }

  return await makeVirtualOutput();
}

export async function getInput(name?: string, fallbackToVirtual?: boolean) {
  if (name) {
    const input = new midi.Input();
    const portNumber: number | string = getPortNumber(name, input);

    if (typeof portNumber === 'string') {
      if (fallbackToVirtual) {
        console.warn(portNumber);
        return await makeVirtualInput();
      }
      throw new Error(portNumber);
    }

    input.openPort(portNumber);
    return input;
  }

  return await makeVirtualInput();
}

