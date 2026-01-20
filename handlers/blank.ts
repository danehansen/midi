import { StatefulMessageHandler } from ".";

const blank: StatefulMessageHandler = (message, callback) => {
  callback(message)
}

export default blank;