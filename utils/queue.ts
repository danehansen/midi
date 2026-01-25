import { MidiMessage } from "midi";
import { Callback, KeyboardState } from "./types";
import { getPitch, getVelocity } from "./getMessageProps";
import dataViz from "./dataViz";
import { MidiMessageStatus } from "./const";

type TimeoutId = ReturnType<typeof setTimeout>;

export class Queue {
  #state: KeyboardState = {};
  #callback?: Callback;
  #timeoutIds: TimeoutId[] = [];
  // #maxLength: number = 0;

  constructor(callback?: Callback) {
    this.#callback = callback;
  }

  insertMessage = (message: MidiMessage, delay?: number) => {
    const playMessage = this.#playMessage.bind(this, message);
    if (!delay) {
      playMessage()
    } else {
      const timeoutId = setTimeout(() => {
        playMessage();
        const index = this.#timeoutIds.indexOf(timeoutId);
        if (index >= 0) {
          this.#timeoutIds.splice(index, 1);
        }
      }, delay);
      this.#timeoutIds.push(timeoutId);
    }
  }

  #playMessage = (message: MidiMessage) => {
    const p = getPitch(message);
    const v = getVelocity(message);
    if (v) {
      this.#state[p] = message;
    } else {
      delete this.#state[p];
    }
    this.#callback?.(message);
  }

  kill = () => {
    this.#timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
  }

  stopAll = () => {
    this.currentNotes.forEach((message) => {
      this.insertMessage([MidiMessageStatus.NOTE_OFF, getPitch(message), 0])
    })
  }

  vizualize = () => {
    dataViz(this.#state);
    // const currentLength = this.currentNotes.length
    // this.#maxLength = Math.max(this.#maxLength, currentLength)
    // console.log({ currentLength, maxLength: this.#maxLength });
  }

  get currentNotes(): MidiMessage[] {
    return Object.values(this.#state).filter((m) => !!m)
  }
}
