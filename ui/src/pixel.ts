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
  /** If it is null, it means the server placed the pixel */
  user: string | null;
  public selectCallback: (pixel: Pixel) => void;
  // Storing the locations is a necessary evil
  public x: number;
  public y: number;

  /**
  * @param color the color of the pixel
  * @param x index of the inner array
  * @param y index of the outer array
  * @param container the container this pixel is in
  * @param user the user or uuid
  * @param selectCallback the callback that gets called whenever it gets clicked
  */
  constructor(color: number, x: number, y: number, container: Container, user: string | null, selectCallback: (pixel: Pixel) => void) {
    this.x = x;
    this.y = y;
    this.sprite = this.createSquare(x, y);
    this.color = color; // Make sure to assign this later because it relies on this.sprite being set
    this.user = user;
    this.selectCallback = selectCallback;

    this.registerEvents();
    container.addChild(this.sprite);
  }

  /**
   * Gets the darkness of a color
   * 0 is the darkest
   * 255 is the lightest
   */
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
      .fill(0xffffff);
  }

  private registerEvents() {
    this.sprite.eventMode = "static";
    this.sprite.on("click", (_: FederatedPointerEvent) => {
      this.selectCallback(this);
    });
  }

}

export type PixelMatrix = Pixel[][];


