import express, { Express, Request, Response } from "express";
import WebSocket from "ws";
import cors from "cors";
import { Message, NetPixel, NetPixelMatrix, PixelChange, ChatMessage } from "../../lib";
import { generatePixels } from "./util";
import { Client } from "pg";
import { loadEnv as loadAppEnv } from "./env";

const app: Express = express();
const env = loadAppEnv();
const client = new Client(env.db);

async function databaseStuff(client: Client): Promise<string> {
  // await client.connect();

  console.log("connected!");
  const result = await client.query("SELECT 1+1 AS result;");
  return "I got:" + result.rows.toString()
}

const server = new WebSocket.Server({ port: env.wsPort });

app.use(
  cors({ origin: env.corsDomain })
);

app.get("/", async (_req: Request, res: Response) => {
  const dbRes = await databaseStuff(client);
  res.send(dbRes)
});


app.get("/pixels", (_req: Request, res: Response) => {
  res.json(pixels);
});

const pixels: NetPixelMatrix = generatePixels();

let sockets: WebSocket[] = [];
server.on("connection", function(socket) {
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on("message", function(msg) {

    let req = msg.toString();
    let raw: Message = JSON.parse(req);
    if (raw.type == "pixelColor") {
      const pixel = raw as PixelChange;

      const netPixel: NetPixel = {
        color: pixel.pixelColor,
        user: null,
      };
      pixels[pixel.yPos][pixel.xPos] = netPixel;
    } else if (raw.type == "chatMessage") {
      const newMessage = raw as ChatMessage;
    }

    sockets.forEach((s) => s.send(JSON.stringify(raw)));
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on("close", function() {
    sockets = sockets.filter((s) => s !== socket);
  });
});

app.listen(env.appPort, () => {
  console.log(`Server starting at ${env.corsDomain}`);
});
