//   { user: null, color: 0xffffff },

import { Container, FederatedPointerEvent, Graphics } from "pixi.js";

export class Pixel {
  color: number;
  sprite: Graphics;
  /* If it is null, it means the server placed the pixel */
  user: string | null;
  selectCallback: (pixel: Pixel) => void;

  /**
  * @param x index of the inner array
  * @param y index of the outer array
  */
  constructor(color: number, x: number, y: number, container: Container, user: string | null, selectCallback: (pixel: Pixel) => void) {
    this.color = color;
    this.sprite = this.createSquare(x, y);
    this.user = user;
    this.selectCallback = selectCallback;

    this.registerEvents();
    container.addChild(this.sprite);
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

export type PixelMatrix = Pixel[][];
