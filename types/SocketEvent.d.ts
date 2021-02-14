import { Message } from "./Message";

// "{x: number, y: number}"
type Coords = string;

export type BroadcastEvent = {
  type: "broadcast";
  value: {
    raw: Message;
    html: string;
  };
};

export type BroadcastMouseEvent = {
  type: "broadcastMouse";
  value: Coords;
};

export type MessageEvent = {
  type: "message";
  value: Message;
};

export type MouseEvent = {
  type: "mousemove";
  value: Coords;
};

export type ConnectEvent = {
  type: "connect";
};

export type SaveEvent = {
  type: "save";
};

export type SavingEvent = {
  type: "saving";
};

export type SavedEvent = {
  type: "saved";
};

export type NextPageEvent = {
  type: "nextPage";
};

export type SerialisedSocketEvent = string;
export type SocketEvent =
  | BroadcastEvent
  | BroadcastMouseEvent
  | MessageEvent
  | MouseEvent
  | ConnectEvent
  | SaveEvent
  | SavingEvent
  | SavedEvent
  | NextPageEvent;
