import "./style.scss"

import {
  Application,
} from "pixi.js";

import { Board } from "./board";
import { NetPixel, NetPixelMatrix } from "./pixel";
import { Bar } from "./bar";

const API_URL = "http://localhost:3000";

(async () => {
  const root = document.getElementById("app");
  if (root === null) {
    throw Error("Root not found");
  }


  const app = new Application();
  await app.init({ background: "#ffffff", resizeTo: window });
  app.canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  app.canvas.style.position = "absolute";


  const socket = new WebSocket("ws://localhost:3001");

    interface PixelChange {
        pixelColor: number,
        xPos: number,
        yPos: number,
    }

  // Listen for messages
  socket.addEventListener("message", (event) => {
    const message: PixelChange = JSON.parse(event.data);
    
    const pixel: NetPixel = {
      color: message.pixelColor,
      user: null
    }

    board.setPixel(pixel, message.xPos, message.yPos)
    console.log("Message from server ", event.data);
  });

  // board.setPixel({ color: 0x00ff00, user: null }, 2, 2)

  let req = await fetch(API_URL + "/pixels");
  let pixels = await req.json();

  const board = new Board(pixels, app, socket);

  const eleBottomBar = document.createElement("div");
  eleBottomBar.id = "bottom-bar";

  const bar = new Bar(eleBottomBar, board.createSetColorCallback());

  root.append(eleBottomBar);


  root.appendChild(app.canvas);

})()
