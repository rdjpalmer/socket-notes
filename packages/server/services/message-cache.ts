import { Message } from "../../../types/Message";

export class MessageCache {
  cache: Message[] = [];

  add(message: Message): Message {
    if (this.cache.length >= 20) {
      this.cache.unshift();
    }

    this.cache.push(message);

    return message;
  }

  last(): Message {
    return this.cache[this.cache.length - 1];
  }
}