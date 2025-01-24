import {
  Application,
  Container,
  ContainerChild,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Rectangle,
  Renderer,
} from "pixi.js";

import { Pixel, PixelMatrix } from "./pixel";
import { OutlineFilter } from "pixi-filters";
import { NetPixel, NetPixelMatrix, PixelChange } from "../../lib";

/**
 * Manages the pixel board and all it's pixels.
 * Once the pixels have been defined, new pixels cannot be added without a page refresh
 */
export class Board {
  private pixels: PixelMatrix;
  container: Container<ContainerChild>;
  selectedPixel: Pixel | null = null;
  socket: WebSocket;

  constructor(
    pixels: NetPixelMatrix,
    app: Application<Renderer>,
    socket: WebSocket
  ) {
    this.container = this.init(app.stage, app.screen);
    this.pixels = this.netPixelsToPixels(pixels);
    this.socket = socket;
    this.resizeDefault();
  }

  /**
   * Sets the pixel without sending it to the server
   */
  public setPixel(netPixel: NetPixel, x: number, y: number): boolean {
    const pixel = this.pixels[y]?.[x];
    if (pixel === undefined) {
      return false;
    }
    pixel.color = netPixel.color;
    pixel.user = netPixel.user;
    return true;
  }

  /**
  * Converts pixels that do not have a sprite to pixels that do have a sprite
  */
  netPixelsToPixels(netPixels: NetPixelMatrix) {
    let oldZ: number | null = null;
    const selectionCallback = (pixel: Pixel) => {
      // Check if selected pixel exists
      if (this.selectedPixel) {
        this.selectedPixel.sprite.filters = [];
        this.selectedPixel.sprite.zIndex = oldZ || 0;
      }

      let color = 0xffffff;
      if (pixel.color == 0xffffff) {
        color = 0x000000;
      }
      pixel.sprite.filters = [
        new OutlineFilter({
          thickness: 2,
          color: color,
        }),
      ];
      oldZ = pixel.sprite.zIndex;
      pixel.sprite.zIndex = 100; // Arbitrary big number

      this.selectedPixel = pixel;
    };

    const pixels: PixelMatrix = [];
    // boomer loops because I couldn't get for..in to work
    for (let i = 0; i < netPixels.length; i++) {
      const netInnerPixels = netPixels[i];
      const pixelList: Pixel[] = [];
      for (let j = 0; j < netInnerPixels.length; j++) {
        const netPixel = netInnerPixels[j];
        pixelList.push(
          new Pixel(
            netPixel.color,
            j,
            i,
            this.container,
            netPixel.user,
            selectionCallback
          )
        );
      }
      pixels.push(pixelList);
    }
    return pixels;
  }

  /**
  * This is for {@link Bar#paletteInit}
  */
  public createSetColorCallback(): (num: number) => void {
    return (color: number) => {
      const pixel = this.selectedPixel;
      if (pixel == null) {
        return;
      }
      pixel.color = color;

      const msg: PixelChange = {
        type: "pixelColor",
        pixelColor: color,
        xPos: pixel.x,
        yPos: pixel.y,
      };
      this.socket.send(JSON.stringify(msg));
    };
  }

  resizeDefault() {
    const board = this.container;
    board.scale.set(2, 2);
    board.x = screen.width / 2 - board.width / 2;
    board.y = screen.height / 2 - board.height / 2;
  }

  init(
    stage: Container<ContainerChild>,
    screen: Rectangle
  ): Container<ContainerChild> {
    const board = new Container();

    // Add scroll wheel event
    board.on("wheel", (event: FederatedWheelEvent) => {
      const offsetX = (event.globalX - board.position.x) / board.width;
      const offsetY = (event.globalY - board.position.y) / board.height;

      const toAdd = event.deltaY / 100;
      const x = Math.max(board.scale._x - toAdd, 0.5);
      const y = Math.max(board.scale._y - toAdd, 0.5);
      board.scale.set(x, y);

      const newOffsetX = (event.globalX - board.position.x) / board.width;
      const newOffsetY = (event.globalY - board.position.y) / board.height;
      board.position.x += (newOffsetX - offsetX) * board.width;
      board.position.y += (newOffsetY - offsetY) * board.height;
    });

    // Event stuff
    stage.interactive = true;
    board.eventMode = "dynamic";
    board.cursor = "pointer";
    stage.hitArea = screen;

    // Movement
    stage.on("rightdown", onDragStart);
    stage.on("rightup", onDragEnd);
    stage.on("rightupoutside", onDragEnd);

    function onDragMove(event: FederatedPointerEvent) {
      board.x += event.movementX;
      board.y += event.movementY;
    }

    function onDragStart() {
      stage.on("pointermove", onDragMove);
    }

    function onDragEnd() {
      stage.off("pointermove", onDragMove);
    }

    // Keyboard stuff
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      if (key === " ") {
        this.resizeDefault();
      }
    });

    document.addEventListener("keydown", (event) => {
      const key = event.key;

      const pixel = this.selectedPixel;
      if (pixel === null) {
        return;
      }
      let selected;
      if (key === "ArrowUp") {
        selected = this.pixels[pixel.y - 1]?.[pixel.x];
      } else if (key === "ArrowDown") {
        selected = this.pixels[pixel.y + 1]?.[pixel.x];
      } else if (key === "ArrowLeft") {
        selected = this.pixels[pixel.y][pixel.x - 1];
      } else if (key === "ArrowRight") {
        selected = this.pixels[pixel.y][pixel.x + 1];
      }
      if (selected === undefined) {
        return;
      }
      selected.selectCallback(selected);
      this.selectedPixel = selected;
    });

    stage.addChild(board);
    return board;
  }
}
