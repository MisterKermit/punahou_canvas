import express, { Express, Request, Response } from "express";
import WebSocket from "ws";
import cors from "cors";
import { generatePixels, NetPixel, NetPixelMatrix } from "./util";

const app: Express = express();
const port = process.env.PORT || 3000;

const server = new WebSocket.Server({
  port: 3001,
});

const pixels: NetPixelMatrix = generatePixels();

let sockets: WebSocket[] = [];
server.on("connection", function(socket) {
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on("message", function(msg) {

    interface Message {
      type: string
    }

    interface PixelChange {
      type: string,
      pixelColor: number,
      xPos: number,
      yPos: number,
    }

    interface ChatMessage {
      type: string,
      message: string
    }

    let req = msg.toString();
    let raw: Message = JSON.parse(req)
    if (raw.type == "pixelColor") {
      const pixel = raw as PixelChange;
      
      const netPixel: NetPixel = {
        color: pixel.pixelColor,
        user: null
      }
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

app.use(
  cors({
    origin: "http://localhost:8080",
  })
);


app.get("/", (_req: Request, res: Response) => {
  res.send("It works");
});

app.get("/pixels", (_req: Request, res: Response) => {
  res.json(pixels);
});

app.listen(port, () => {
  console.log(`Server starting at http://localhost:${port}`);
});
