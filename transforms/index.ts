import { MidiMessage } from "midi";
import { KeyboardState } from "../utils/types";

export type Transformer = (message: MidiMessage, preexistingState: KeyboardState, options?: any) => MidiMessage[];