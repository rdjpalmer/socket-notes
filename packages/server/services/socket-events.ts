import { Server, Connection } from "sockjs";
import { SocketEvent, SerialisedSocketEvent } from "../../../types/SocketEvent";

type HandleConnection = (connection: Connection) => void;
type HandleEvent = (event: SocketEvent) => void;
type HandleClose = (connection: Connection) => void;

interface SocketEventsOptions {
  handleConnection: HandleConnection;
  handleEvent: HandleEvent;
  handleClose: HandleClose;
}

export class SocketEvents {
  private server: Server;
  private handleConnection: HandleConnection = () => {};
  private handleEvent: HandleEvent = () => {};
  private handleClose: HandleClose = () => {};

  constructor(server: Server, options: SocketEventsOptions) {
    const { handleConnection, handleEvent, handleClose } = options;

    this.server = server;
    this.handleConnection = handleConnection;
    this.handleEvent = handleEvent;
    this.handleClose = handleClose;

    this.onData = this.onData.bind(this);
    this.onClose = this.onClose.bind(this);

    this.server.on("connection", this.onConnection.bind(this));
  }

  private onConnection(connection: Connection) {
    connection.on("data", this.onData.bind(this));
    connection.on("close", this.onClose.bind(this));

    this.handleConnection(connection);
    this.handleEvent({ type: "connect" });
  }

  private onData(serialisedEvent: SerialisedSocketEvent) {
    const event: SocketEvent = JSON.parse(serialisedEvent);

    this.handleEvent(event);
  }

  private onClose(connection: Connection) {
    this.handleClose(connection);
  }
}