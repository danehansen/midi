import killAll from './';
import midi from 'midi';

(function () {
  const output = new midi.Output();
  for (let portNumber = 0; portNumber < output.getPortCount(); portNumber++) {
    output.openPort(portNumber);
    killAll(output);
    output.closePort();
  }
  process.exit(0);
})();