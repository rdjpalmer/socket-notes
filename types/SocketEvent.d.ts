export type MessageEvent = {
  type: "message"
  value: string;
}

export type SaveEvent = {
  type: "event",
  value: "save"
}

export type SerialisedSocketEvent = "string";
export type SocketEvent = MessageEvent | SaveEvent;