import "./style.scss"

import {
  Application,
} from "pixi.js";

import { Board } from "./board";
import { NetPixelMatrix } from "./pixel";

(async () => {
  const app = new Application();
  await app.init({ background: "#ffffff", resizeTo: window });

  app.canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  app.canvas.style.position = "absolute";

  // Send this over from the web later 
  const samplePixels: NetPixelMatrix = [
    [{ color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null },],
    [{ color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null },],
    [{ color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null },],
    [{ color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null },],
    [{ color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null }, { color: 0xff0000, user: null },],
  ];
  const board = new Board(samplePixels, app);
  board.setPixel({ color: 0x00ff00, user: null }, 2, 2)

  document.body.appendChild(app.canvas);

})()
