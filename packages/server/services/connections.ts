import { Connection } from "sockjs";
import { Message } from "../types/message";

export class Connections {
  connections: Connection[];

  constructor() {
    this.connections = [];
  }

  add(connection: Connection) {
    this.connections.push(connection);
  }

  remove(connection: Connection) {
    this.connections = this.connections.filter(c => c === connection);
  }

  write(message: Message) {
    this.connections.forEach(c => c.write(message));
  }
}