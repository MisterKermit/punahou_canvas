import {
  Application,
  Assets,
  Container,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Graphics,
  Sprite,
} from "pixi.js";

import { Pixel, PixelMatrix } from "./pixel";

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application({
    eventFeatures: {
      wheel: true,
    }
  });

  // Intialize the application.
  await app.init({ background: "#1099bb", resizeTo: window });

  
  // you should close the live share server
  app.canvas.style.position = "absolute";

  // Add user data later
  const pixels: PixelMatrix = [
    [
      new Pixel(0xff0000, 100, 100),
      new Pixel(0xff0000, 110, 100),
      new Pixel(0xff0000, 120, 100),
    ],
    [
      new Pixel(0xff0000, 100, 110),
      new Pixel(0xff0000, 110, 110),
      new Pixel(0xff0000, 120, 110),
    ],
    [
      new Pixel(0xff0000, 100, 120),
      new Pixel(0xff0000, 110, 120),
      new Pixel(0xff0000, 120, 120),
    ],
  ];

  const board = new Container();
  for (const pixelList of pixels) {
    for (const pixel of pixelList) {
      board.addChild(pixel.sprite);
    }
  }

  // from here on out: oh the misery

  // container.position.add()

  app.stage.on("wheel", (event: FederatedWheelEvent) => {
    const center = board.height * 0.5;
    board.pivot.set(center, center);
    const toAdd = event.deltaY / 150;
    board.scale.set(board.scale._x + toAdd, board.scale._y + toAdd)
  });


  app.stage.addChild(board);

  app.stage.interactive = true;
  board.eventMode = "static";
  board.cursor = "pointer";

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  app.stage.on("pointerdown", onDragStart);
  app.stage.on("pointerup", onDragEnd);
  app.stage.on("pointerupoutside", onDragEnd);

  function onDragMove(event: FederatedPointerEvent) {
    board.x += event.movementX;
    board.y += event.movementY;
    event;
  }

  function onDragStart() {
    app.stage.on("pointermove", onDragMove);
  }

  function onDragEnd() {
    app.stage.off("pointermove", onDragMove);
  }
})();
