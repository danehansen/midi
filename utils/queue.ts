import { MidiMessage } from "midi";
import { Callback, KeyboardState } from "./types";



export class Queue {
  #state: KeyboardState = {};
  #callback: Callback;

  constructor(callback: Callback) {
    this.#callback = callback;
  }

  insertMessage = (message: MidiMessage, delay?: number) => {
    const playMessage = this.#playMessage.bind(this, message);
    if (!delay) {
      playMessage()
    } else {
      const timeoutId = setTimeout(() => {
        playMessage()
      }, delay);
    }
  }

  #playMessage = (message: MidiMessage) => {
    this.#callback(message);
  }

  kill = () => {

  }
}