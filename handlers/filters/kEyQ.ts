import { MidiMessage } from "midi";
import { Pitch, Taper } from "../../utils/types";
import * as eases from "../../utils/eases";
import { MidiRange } from "../../utils/const";
import math from '@danehansen/math';
import { Filter } from ".";

type Options = {
  lowPass?: Pitch;
  highPass?: Pitch;
  taper?: Taper;
  ease?: eases.Ease;
}

const kEyQ: Filter = ([status, pitch, velocity]: MidiMessage, {
  lowPass = MidiRange.MAX,
  highPass = MidiRange.MIN,
  ease = eases.inCirc,
  taper = 1,
}: Options = {}): MidiMessage => {
  if (pitch < highPass || pitch > lowPass) {
    return [status, pitch, MidiRange.MIN];
  }
  let v: number = velocity;
  const nPitch = math.normalize(highPass - 1, lowPass + 1, pitch); // range expanded by 1 on each end so that the highest/lowest notes are not wastest as velocity 0
  const taperIn = taper / 2
  const taperOut = 1 - taperIn;
  if (nPitch < taperIn) {
    v *= ease(nPitch / taperIn);
  } else if (nPitch > taperOut) {
    v *= ease((1 - nPitch) / taperIn);
  }

  return [status, pitch, Math.round(v)];
}

export default kEyQ;

