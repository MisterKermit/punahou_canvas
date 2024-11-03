
export class Bar {
  private root: HTMLDivElement
  constructor(root: HTMLDivElement, setColorCallback: (color: number) => void) {
    this.root = root;
    this.init(root, setColorCallback);
  }

  init(root: HTMLDivElement, setColorCallback: (color: number) => void) {
    const palette = document.createElement("div");
    palette.id = "palette";

    const colors = document.createElement("div");
    colors.id = "colors";
    palette.appendChild(colors);

    const rgb = (r: number, g: number, b: number) => {
      return (r << 16 | g << 8 | b);
    };
    const paletteColors = [
      rgb(0, 0, 0),
      rgb(105, 105, 105),
      rgb(85, 85, 85),
      rgb(128, 128, 128),
      rgb(211, 211, 211),
      rgb(255, 255, 255),
      rgb(255, 153, 153),
      rgb(204, 51, 51),
      rgb(220, 20, 60),
      rgb(153, 0, 0),
      rgb(128, 0, 0),
      rgb(255, 87, 0),
      rgb(204, 255, 140),
      rgb(129, 222, 118),
      rgb(0, 111, 60),
      rgb(58, 85, 180),
      rgb(108, 173, 223),
      rgb(140, 217, 255),
      rgb(0, 255, 255),
      rgb(183, 125, 255),
      rgb(190, 69, 255),
      rgb(250, 57, 131),
      rgb(255, 153, 0),
      rgb(255, 230, 0),
      rgb(87, 52, 0),
    ];
    console.log(paletteColors);

    for (const i in paletteColors) {
      const paletteColor = paletteColors[i];
      const color = document.createElement("div");

      const toDOMColor = (num: number) => {
        num >>>= 0;
        var b = num & 0xFF,
          g = (num & 0xFF00) >>> 8,
          r = (num & 0xFF0000) >>> 16
        return "rgb(" + [r, g, b].join(",") + ")";
      }

      color.style.background = toDOMColor(paletteColor);
      color.dataset.color = i.toString();

      color.addEventListener("click", _ => {
        setColorCallback(paletteColors[Number(color.dataset.color)]);
      });

      colors.appendChild(color)
    }
    root.appendChild(palette);

  }
}
