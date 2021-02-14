import * as React from "react";
import { SocketStatus } from "../useSocket/useSocket";

import "./StatusBar.css";

interface StatusBarProps {
  status: SocketStatus;
  children?: React.ReactNode;
}

export default function StatusBar(props: StatusBarProps) {
  const { status, children } = props;

  // "statusBar-grid w-screen bg-grey-100 p-4 grid gap-4 items-center"

  return (
    <div className="w-screen p-4 bg-grey-100 grid gap-4 items-center statusBar-grid border-gray-300 border-b">
      <StatusCircle status={status} />
      <span className="statusBar-text">{status}</span>
      {children && <div className="self-end w-full">{children}</div>}
    </div>
  );
}

interface StatusCircleProps {
  status: SocketStatus;
}

const StatusColor: Record<SocketStatus, string> = {
  idle: "grey-300",
  connecting: "blue-600",
  connected: "green-600",
  closed: "red-600",
};

function StatusCircle(props: StatusCircleProps) {
  const { status } = props;
  const color = StatusColor[status];

  return (
    <svg viewBox="0 0 16 16" className={`w-2 h-2 text-${color}`}>
      <circle cx={8} cy={8} r={8} fill="currentColor" />
    </svg>
  );
}
