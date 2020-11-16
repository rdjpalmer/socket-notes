import sockjs from "sockjs";

import createServer from "./create-server";
import { assignSocketEventHandlers } from "./socket-event-handlers";
import router from "./router";

const PORT = 9999;
const HOSTNAME = "0.0.0.0";
const SockJSRoute = "/echo";

async function initialise() {
  const [application, _, sockjsServer] = await createServer({
    port: PORT,
    hostname: HOSTNAME,
    sockjsInstance: sockjs.createServer(),
    sockjsUrl: SockJSRoute
  });

  application.use(router);
  assignSocketEventHandlers(sockjsServer);
}

initialise();