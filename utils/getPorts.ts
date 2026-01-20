import JZZ from 'jzz';
import { MidiMessage, Input, Output } from 'midi';
import killAll from './killAll';

// let count = 0;

async function makeVirtualOutput(): Promise<Output> {
  const jzz = await JZZ()
    .or('Cannot start MIDI engine!')
    .openMidiOut()
    .or('Cannot open MIDI Out port!')

  return {
    jzz,
    sendMessage(m: MidiMessage) {
      // count++;
      // console.log({ count });
      jzz.send(m)
        .or('problem sending')
    },
    closePort() {
      jzz.close();
    }
  } as unknown as Output
}

async function makeVirtualInput(): Promise<Input> {
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
  } as unknown as Input
}

function getPortNumber(str: string, put: Output | Input): number | string {
  const count = put.getPortCount();
  if (!count) {
    return "no ports found.";
  }
  const names = [];
  for (let i = 0; i < count; i++) {
    const name = put.getPortName(i)
    if (name === str) {
      return i;
    }
    names.push(name);
  }
  return `no port found named ${str}. only these: ${names}`
}

export async function getOutput(name?: string, fallbackToVirtual?: boolean): Promise<Output> {
  if (name) {
    const output = new Output();
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
        // count++;
        // console.log({ count });
        output.sendMessage(m);
      },
      closePort() {
        killAll(output);
        output.closePort();
      },
    } as Output
  }

  return await makeVirtualOutput();
}

export async function getInput(name?: string, fallbackToVirtual?: boolean): Promise<Input> {
  if (name) {
    const input = new Input();
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

