import killAll from './';
import { Output } from 'midi';

(function () {
  const output = new Output();
  for (let portNumber = 0; portNumber < output.getPortCount(); portNumber++) {
    output.openPort(portNumber);
    killAll(output);
    output.closePort();
  }
  process.exitCode = 0;
})();