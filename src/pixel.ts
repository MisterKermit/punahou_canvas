//   { user: null, color: 0xffffff },

import { Container, FederatedPointerEvent, Graphics } from "pixi.js";

export class Pixel {
  private assigned_color!: number;
  get color() {
    return this.assigned_color;
  }
  set color(it) {
    this.assigned_color = it;
    this.sprite.tint = it;
  }

  sprite: Graphics;
  /* If it is null, it means the server placed the pixel */
  user: string | null;
  public selectCallback: (pixel: Pixel) => void;
  // Storing the locations is a necessary evil
  public x: number;
  public y: number;

  /**
  * @param x index of the inner array
  * @param y index of the outer array
  */
  constructor(color: number, x: number, y: number, container: Container, user: string | null, selectCallback: (pixel: Pixel) => void) {
    this.x = x;
    this.y = y;
    this.sprite = this.createSquare(x, y);
    this.color = color; // Make sure to assign this later because it relies on this.sprite
    this.user = user;
    this.selectCallback = selectCallback;

    this.registerEvents();
    container.addChild(this.sprite);
  }

  getLuma() {
    // https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
    const color = this.color;
    const r = (color >> 16) & 0xff;  // extract red
    const g = (color >> 8) & 0xff;  // extract green
    const b = (color >> 0) & 0xff;  // extract blue

    return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  }

  private createSquare(x: number, y: number): Graphics {
    const SIZE = 10;
    return new Graphics()
      .rect(x * SIZE, y * SIZE, SIZE, SIZE)
      .fill(this.color);
  }

  private registerEvents() {
    this.sprite.eventMode = "dynamic";
    this.sprite.on("click", (_: FederatedPointerEvent) => {
      this.selectCallback(this);
    });
  }

}

/*
 * A pixel that is able to be serialized and sent through the internet
 */
export interface NetPixel {
  color: number,
  user: string | null,
};

export type PixelMatrix = Pixel[][];
export type NetPixelMatrix = NetPixel[][];


