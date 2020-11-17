import { Server, Connection } from "sockjs";
import { SocketEvent, MessageEvent, SaveEvent, SerialisedSocketEvent } from "../../../types/SocketEvent";
import { Message, MessageTransformer } from "../../../types/Message";
import { Connections } from "./connections";

interface Cache {
  add: (message: string) => Message;
  last: () => Message;
}

export class SocketEvents {
  private server: Server;
  private connections: Connections;
  private cache: Cache;
  private transformer: MessageTransformer = (value) => value;

  constructor(server: Server, connections: Connections, cache: Cache, transformer: MessageTransformer) {
    this.server = server;
    this.connections = connections;
    this.cache = cache;
    this.transformer = transformer;

    this.server.on("connection", this.onConnection);
  }

  private onConnection(connection: Connection) {
    this.connections.add(connection);
    this.connections.write(this.cache.last())

    connection.on("data", this.onData);
    connection.on("close", this.onClose);
  }

  private onData(serialisedEvent: SerialisedSocketEvent) {
    const event: SocketEvent = JSON.parse(serialisedEvent);

    if (event.type === "message") {
     this.onMessage(event);
    } else if (event.type === "event") {
      this.onEvent(event);
    }
  }

  private onMessage(event: MessageEvent) {
    const message = this.transformer(event.value);
    this.cache.add(message);
    this.connections.write(this.cache.last());
  }

  private onEvent(event: SaveEvent) {
    if (event.value === "save") {
      // this.diskManager.save(this.cache.last());
    }
  }

  private onClose(connection: Connection) {
    this.connections.remove(connection);
    // save
  }
}