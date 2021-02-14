import * as React from "react";
import "./App.css";
import useSocket from "./useSocket/useSocket";
import StatusBar from "./StatusBar/StatusBar";
import Editor from "./Editor/Editor";
import { SerialisedSocketEvent } from "../../../types/SocketEvent";

const { socketUrl = "/echo" } = process.env;

type ChangeEventType = "message" | "mousemove";

type Coords = {
  x: number;
  y: number;
};

class ChangeEvent {
  type: ChangeEventType;
  value: string | Coords;

  constructor(type: ChangeEventType, value: string | Coords) {
    this.type = type;
    this.value = value;
  }

  get(): SerialisedSocketEvent {
    return JSON.stringify({
      type: this.type,
      value: this.value,
    });
  }
}

function App() {
  const [value, setValue] = React.useState<string>("");

  const socketOptions = React.useMemo(
    () => ({
      url: socketUrl,
      onMessage: (event: MessageEvent<SerialisedSocketEvent>) => {
        const data = JSON.parse(event.data);

        if (data.type === "broadcast") {
          setValue(data.value.raw);
        }
      },
      onClose: (e: any) => console.log("close", e),
    }),
    []
  );

  // @ts-ignore
  const [socketStatus, sockets] = useSocket(socketOptions);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;

    const change = new ChangeEvent("message", value);

    setValue(value);
    sockets && sockets.send(change.get());
  }

  return (
    <div className="grid min-h-screen editor-grid">
      <StatusBar status={socketStatus} />
      <Editor id="editor" value={value} onChange={handleChange} />
    </div>
  );
}

export default App;
