import "./style.scss"

import {
  Application,
  Container,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Graphics,
} from "pixi.js";

import { Pixel, PixelMatrix } from "./pixel";
import { OutlineFilter } from "pixi-filters";

(async () => {
  const app = new Application();
  await app.init({ background: "#ffffff", resizeTo: window });

  app.canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  app.canvas.style.position = "absolute";

  const board = new Container();

  app.stage.addChild(new Graphics()
    .rect(-5, -5, 10, 10)
    .fill(0xff0000));

  let selectedPixel: Pixel | null = null;
  let oldZ: number | null = null;
  const selectionCallback = (pixel: Pixel) => {
    // Check if selected pixel exists
    if (selectedPixel) {
      selectedPixel.sprite.filters = [];
      selectedPixel.sprite.zIndex = oldZ || 0;
    }

    pixel.sprite.filters = [new OutlineFilter({
      thickness: 2,
      color: 0xffffff
    })];
    oldZ = pixel.sprite.zIndex;
    pixel.sprite.zIndex = 100;

    selectedPixel = pixel;
  };

  function randRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Add user data later
  const pixels: PixelMatrix = [];
  const MATRIX_SIZE = 10;
  for (let i = 0; i < MATRIX_SIZE; i++) {
    const pixelList = [];
    for (let j = 0; j < MATRIX_SIZE; j++) {
      pixelList.push(new Pixel(randRange(0x000000, 0xffffff), j, i, board, null, selectionCallback));
    }
    pixels.push(pixelList);
  }

  board.x = (app.screen.width / 2) - (board.width / 2);
  board.y = (app.screen.height / 2) - (board.height / 2);

  board.on("wheel", (event: FederatedWheelEvent) => {
    const offsetX = (event.globalX - board.position.x) / board.width;
    const offsetY = (event.globalY - board.position.y) / board.height;

    const toAdd = event.deltaY / 100;
    const x = Math.max(board.scale._x - toAdd, 0.5);
    const y = Math.max(board.scale._y - toAdd, 0.5);
    board.scale.set(x, y)

    const newOffsetX = (event.globalX - board.position.x) / board.width;
    const newOffsetY = (event.globalY - board.position.y) / board.height;
    board.position.x += (newOffsetX - offsetX) * board.width;
    board.position.y += (newOffsetY - offsetY) * board.height;

  });


  app.stage.addChild(board);

  app.stage.interactive = true;
  board.eventMode = "dynamic";
  board.cursor = "pointer";

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  app.stage.hitArea = app.screen;
  app.stage.on("rightdown", onDragStart);
  app.stage.on("rightup", onDragEnd);
  app.stage.on("rightupoutside", onDragEnd);

  function onDragMove(event: FederatedPointerEvent) {
    board.x += event.movementX;
    board.y += event.movementY;
  }

  function onDragStart() {
    app.stage.on("pointermove", onDragMove);
  }

  function onDragEnd() {
    app.stage.off("pointermove", onDragMove);
  }
})();
