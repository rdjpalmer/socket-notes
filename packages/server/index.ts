import sockjs from "sockjs";

import createServer from "./create-server";
import router from "./router";
import { SocketEvents } from "./services/socket-events";
import { Connections } from "./services/connections";
import { MessageCache } from "./services/message-cache";
import { markdownTransformer } from "./services/transformers";

const PORT = 9999;
const HOSTNAME = "0.0.0.0";
const SockJSRoute = "/echo";

async function initialise() {
  const connections = new Connections();
  const cache = new MessageCache();

  const [application, _, sockjsServer] = await createServer({
    port: PORT,
    hostname: HOSTNAME,
    sockjsInstance: sockjs.createServer(),
    sockjsUrl: SockJSRoute
  });

  application.use(router);

  new SocketEvents(sockjsServer, connections, cache, markdownTransformer);
}

initialise();