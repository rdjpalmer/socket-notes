import * as React from "react";
import SockJS from "sockjs-client";
import { SerialisedSocketEvent } from "../../../../types/SocketEvent";

export type SocketStatus = "idle" | "connecting" | "connected" | "closed";
type UseSocketReturnValue = [SocketStatus, WebSocket | undefined];

interface UseSocketProps {
  url: string;
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent<SerialisedSocketEvent>) => void;
  onClose?: (event: Event) => void;
}

export default function useSocket(props: UseSocketProps): UseSocketReturnValue {
  const { url, onOpen = noop, onMessage = noop, onClose = noop } = props;
  const socketRef = React.useRef<WebSocket>();
  const socketUrlRef = React.useRef<string>(url);
  const [status, setStatus] = React.useState<SocketStatus>("idle");

  const connect = React.useCallback(() => {
    setStatus("connecting");
    socketRef.current = new SockJS(url);

    socketRef.current.onopen = (event) => {
      setStatus("connected");
      onOpen(event);
    };
    socketRef.current.onmessage = (event) => {
      onMessage(event);
    };
    socketRef.current.onclose = (event) => {
      setStatus("closed");
      onClose(event);
    };

    return socketRef.current;
  }, [onClose, onMessage, onOpen, url]);

  React.useEffect(() => {
    socketUrlRef.current = url;
    connect();
  }, [connect, url]);

  return [status, socketRef.current];
}

function noop() {}
