import {
  Application,
  Container,
  ContainerChild,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Rectangle,
  Renderer,
} from "pixi.js";

import { NetPixel, NetPixelMatrix, Pixel, PixelMatrix } from "./pixel";
import { OutlineFilter } from "pixi-filters";

/**
 * Manages the pixel board and all it's pixels.
 * Once the pixels have been defined, new pixels cannot be added without a page refresh
 */
export class Board {
  private pixels: PixelMatrix;
  container: Container<ContainerChild>;
  selectedPixel: Pixel | null = null;

  constructor(pixels: NetPixelMatrix, app: Application<Renderer>) {
    this.container = this.init(app.stage, app.screen);
    this.pixels = this.netPixelsToPixels(pixels);
    this.resizeDefault();
  }

  public setPixel(netPixel: NetPixel, x: number, y: number): boolean {
    const pixel = this.pixels[y]?.[x];
    if (pixel === undefined) {
      return false;
    }
    pixel.color = netPixel.color
    pixel.user = netPixel.user;
    return true;
  }

  netPixelsToPixels(netPixels: NetPixelMatrix) {
    let oldZ: number | null = null;
    const selectionCallback = (pixel: Pixel) => {
      // Check if selected pixel exists
      if (this.selectedPixel) {
        this.selectedPixel.sprite.filters = [];
        this.selectedPixel.sprite.zIndex = oldZ || 0;
      }

      pixel.sprite.filters = [new OutlineFilter({
        thickness: 2,
        color: 0xffffff,
      })];
      oldZ = pixel.sprite.zIndex;
      pixel.sprite.zIndex = 100; // Arbitrary big number

      this.selectedPixel = pixel;
    };

    // Add user data later
    const pixels: PixelMatrix = [];
    // boomer loops because I couldn't get for..in to work
    for (let i = 0; i < netPixels.length; i++) {
      const netInnerPixels = netPixels[i];
      const pixelList: Pixel[] = [];
      for (let j = 0; j < netInnerPixels.length; j++) {
        const netPixel = netInnerPixels[j];
        pixelList.push(new Pixel(netPixel.color, j, i, this.container, netPixel.user, selectionCallback));
      }
      pixels.push(pixelList);
    }
    return pixels;
  }

  public createSetColorCallback(): (num: number) => void {
    return (color: number) => {
      const pixel = this.selectedPixel
      if (pixel == null) {
        return
      }
      pixel.color = color;

    }
  }

  resizeDefault() {
    const board = this.container;
    board.scale.set(2, 2)
    board.x = (screen.width / 2) - (board.width / 2);
    board.y = (screen.height / 2) - (board.height / 2);
  }


  init(stage: Container<ContainerChild>, screen: Rectangle): Container<ContainerChild> {
    const board = new Container();

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

    stage.interactive = true;
    board.eventMode = "dynamic";
    board.cursor = "pointer";
    stage.hitArea = screen;


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

    document.addEventListener("keydown", event => {
      const pixel = this.selectedPixel;
      if (pixel === null) { return; }
      const key = event.key;
      let selected;
      if (key === "ArrowUp") {
        selected = this.pixels[pixel.y - 1]?.[pixel.x];
      } else if (key === "ArrowDown") {
        selected = this.pixels[pixel.y + 1]?.[pixel.x];
      } else if (key === "ArrowLeft") {
        selected = this.pixels[pixel.y][pixel.x - 1];
      } else if (key === "ArrowRight") {
        selected = this.pixels[pixel.y][pixel.x + 1];
      } else if (key == " ") {
        const pixel = this.selectedPixel;
        if (pixel === null) {
          return
        }
        pixel.sprite.tint = 0xffffff;
        pixel.selectCallback(pixel);
      }
      if (selected === undefined) { return; }
      selected.selectCallback(selected);
      this.selectedPixel = selected;
    });

    stage.addChild(board);
    return board;
  }
}

