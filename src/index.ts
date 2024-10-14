import {
  Application,
  Assets,
  Container,
  FederatedPointerEvent,
  Graphics,
  Sprite,
} from "pixi.js";


// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: "#1099bb", resizeTo: window });

  // you should close the live share server
  app.canvas.style.position = "absolute";

  // Add user data later
  const pixels = [
    [
    ]
  ]

  const board = new Container();
  new Graphics().uid
  board.addChild(
    new Graphics()
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill(0xffffff)
  );

  // container.position.add()

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
