import { Connection, Server } from "sockjs";
import showdown from "showdown";

const converter = new showdown.Converter();

function processData(data: string) {
  return converter.makeHtml(data);
}

class ConnectionManager {
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

type Message = string;
type Transformer = (string: string) => string;

class MessageManager {
  messages: Message[];
  transformer: Transformer

  constructor(transformer: Transformer) {
    this.messages = [];
    this.transformer = transformer;
  }

  write(rawMessage: Message) {
    // Limit array length to 20, to keep memory usage low
    if (this.messages.length >= 20) {
      this.messages.shift();
    }

    this.messages.push(this.transformer(rawMessage));
  }

  last() {
    return this.messages[this.messages.length - 1];
  }
}

type SerialisedEventType = string;
type EventType = {
  type: "message",
  payload: Message
} | {
  type: "save",
};

export function assignSocketEventHandlers(server: Server) {
  const connectionManager = new ConnectionManager();
  const messageManager = new MessageManager(processData);

  server.on("connection", (connection: Connection) => {
    connectionManager.add(connection);
    connectionManager.write(messageManager.last());

    connection.on("data", (message: Message) => {
      messageManager.write(message);
      connectionManager.write(messageManager.last());
    });

    // TODO: Enable other event types
    // connection.on("data", (serialisedEvent: SerialisedEventType) => {
    //   const event: EventType = JSON.parse(serialisedEvent);

    //   if (event.type === "message") {
    //     messageManager.write(event.payload);
    //     connectionManager.write(messageManager.last());
    //   }
    // });

    connection.on("close", () => {
      connectionManager.remove(connection);
    });
  });
}