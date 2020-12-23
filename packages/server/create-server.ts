import * as http from "http";
import express, { Application as ExpressApplication } from "express";
import { Server as SockJSServer } from "sockjs";

type CreateServerProps = {
  port: number;
  hostname: string;
  sockjsInstance: SockJSServer;
  sockjsUrl: string;
};

export type ExpressServer = http.Server;
type CreateServerReturnType = Promise<
  [ExpressApplication, ExpressServer, SockJSServer]
>;

export default function createServer(
  props: CreateServerProps
): CreateServerReturnType {
  const { port, hostname, sockjsInstance, sockjsUrl } = props;

  return new Promise((resolve) => {
    const app = express();
    const server = app.listen(port, hostname, () => {
      sockjsInstance.installHandlers(server, { prefix: sockjsUrl });
      resolve([app, server, sockjsInstance]);
    });
  });
}
