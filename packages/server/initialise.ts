import sockjs from "sockjs";
import fs from "fs";
import util from "util";
import path from "path";
import os from "os";
import express from "express";
import format from "date-fns/format";

import createServer from "./create-server";
import router from "./router";
import { SocketEvents } from "./services/socket-events";
import { Connections } from "./services/connections";
import { MessageCache } from "./services/message-cache";
import { markdownTransformer } from "./services/transformers";
import { SocketEvent } from "../../types/SocketEvent";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const PORT = 9999;
const HOSTNAME = "0.0.0.0";
const SockJSRoute = "/echo";

const interfaces = os.networkInterfaces();

async function save(content: string) {
  const fileName = content
    .substring(0, 25)
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  const date = format(new Date(Date.now()), "yy-MM-dd");
  const dir = path.resolve(__dirname, "../../tmp");
  const filePath = path.resolve(dir, `${date}-${fileName}.md`);

  await mkdir(dir, { recursive: true });
  return writeFile(filePath, content, "utf8");
}

function saveSync(content: string) {
  const date = format(new Date(Date.now()), "yy-MM-dd");
  const dir = path.resolve(__dirname, "../../tmp");
  const filePath = path.resolve(dir, `${date}-cache.md`);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

async function getCache() {
  const date = format(new Date(Date.now()), "yy-MM-dd");
  const dir = path.resolve(__dirname, "../../tmp");
  const filePath = path.resolve(dir, `${date}-cache.md`);

  try {
    const file = await readFile(filePath, "utf8");
    return file;
  } catch {
    return null;
  }
}

async function initialise() {
  const connections = new Connections();
  let cache = new MessageCache();

  const cached = await getCache();
  if (cached) cache.add(cached);

  const [application, _, sockjsServer] = await createServer({
    port: PORT,
    hostname: HOSTNAME,
    sockjsInstance: sockjs.createServer({
      log: () => {},
    }),
    sockjsUrl: SockJSRoute,
  });

  application.use(router);

  application.use(
    "/static",
    express.static(path.join(__dirname, "../editor/build/static"))
  );

  function broadcast(message: string) {
    connections.write(
      JSON.stringify({
        type: "broadcast",
        value: {
          raw: message,
          html: markdownTransformer(message),
        },
      })
    );
  }

  async function handleEvent(event: SocketEvent) {
    if (event.type === "connect") {
      broadcast(cache.last());
    }

    if (event.type === "message") {
      cache.add(event.value);
      broadcast(event.value);
    }

    if (event.type === "save") {
      connections.write(
        JSON.stringify({
          type: "saving",
        })
      );

      await save(cache.last());
      connections.write(
        JSON.stringify({
          type: "saved",
        })
      );
    }

    if (event.type === "nextPage") {
      connections.write(
        JSON.stringify({
          type: "saving",
        })
      );

      await save(cache.last());

      connections.write(
        JSON.stringify({
          type: "saved",
        })
      );

      // blow away the cache, and the state
      cache = new MessageCache();
      broadcast("");
    }
  }

  new SocketEvents(sockjsServer, {
    handleConnection: (connection) => {
      connections.add(connection);
    },
    handleEvent: handleEvent,
    handleClose: (connection) => {
      connections.remove(connection);
    },
  });

  function exitHandler() {
    saveSync(cache.last());
    process.exit();
  }

  const address = getNetworkAddress();

  console.log(`
  Welcome to SocketNotes.

  Please visit ${address}:${PORT} on your Kindle's experimental web browser.

  Please visit ${address}:${PORT}/editor on your input device's web browser.
`);

  process.on("exit", exitHandler.bind(null, { cleanup: true }));
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

const getNetworkAddress = () => {
  for (const name of Object.keys(interfaces)) {
    for (const inyourface of interfaces[name] || []) {
      const { address, family, internal } = inyourface;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
};

export default initialise;
