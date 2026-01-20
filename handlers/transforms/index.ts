import { MidiMessage } from "midi";
import { KeyboardState } from "../../utils/types";

export interface Transformer { (message: MidiMessage, preexistingState: KeyboardState, options?: {}): MidiMessage[] };