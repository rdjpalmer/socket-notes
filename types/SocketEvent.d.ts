import { Message } from "./Message";

export type BroadcastEvent = {
  type: "broadcast";
  value: {
    raw: Message;
    html: string;
  };
};

export type MessageEvent = {
  type: "message";
  value: Message;
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
  | MessageEvent
  | ConnectEvent
  | SaveEvent
  | SavingEvent
  | SavedEvent
  | NextPageEvent;
