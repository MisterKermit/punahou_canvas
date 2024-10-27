//   { user: null, color: 0xffffff },

import { Graphics } from "pixi.js";
import { v4 as uuid4 } from "uuid";

export class Pixel {
  color: number;
  sprite: Graphics;
  x: number;
  y: number;
  /* If it is null, it means the server placed the pixel */
  user: string | null;

  constructor(color: number, x: number, y: number) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.sprite = this.createSquare();
    this.user = null;
  }

  private createSquare(): Graphics {
    return new Graphics().rect(this.x, this.y, 10, 10).fill(this.color);
  }
}
 
export type PixelMatrix = Pixel[][];