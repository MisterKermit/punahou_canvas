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

  function randRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Send this over from the web later 
  const samplePixels: NetPixelMatrix = [];
  const MATRIX_SIZE = 100; // This looks like the max reasonable dimension
  for (let i = 0; i < MATRIX_SIZE; i++) {
    const pixelList = [];
    for (let j = 0; j < MATRIX_SIZE; j++) {
      pixelList.push({ color: randRange(0x000000, 0xffffff), user: null });
    }
    samplePixels.push(pixelList);
  }

  const board = new Board(samplePixels, app);
  board.setPixel({ color: 0x00ff00, user: null }, 2, 2)

  document.body.appendChild(app.canvas);

})()
