export class Bar {
  private root: HTMLDivElement
  constructor(root: HTMLDivElement, setColorCallback: (color: number) => void, sendMessageCallback: (chatEle: HTMLInputElement) => void) {
    this.root = root;
    this.paletteInit(setColorCallback);
    this.settingsInit(sendMessageCallback);
  }

  private settingsInit(sendMessage: (chatEle: HTMLInputElement) => void) {
    const settings = document.createElement("div");
    settings.classList.add("settings");

    const addIcon = (label: string, src: string, callback: (ev: MouseEvent) => void) => {
      const icon = document.createElement("button");
      icon.classList.add(label);
      icon.classList.add("icon");

      const inner = document.createElement("img");
      inner.draggable = false;
      inner.src = src;
      icon.appendChild(inner);

      icon.addEventListener("click", callback);
      settings.appendChild(icon);
    };

    // Chat input box
    const chatInput = document.createElement("input");
    chatInput.classList.add("chat-input");
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage(chatInput);
      }
    });

    addIcon("login-button", "assets/right-to-bracket-solid.svg", (_) => {
      location.href = "/login";
    });

    // Modal stuff
    const modal = document.createElement("dialog");

    modal.innerHTML = `
      <p>This is a recreation of r/place for punahou students</p>
      <br/>
      <p><b>TODO: Make this more descriptive</b></p>
    `;
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => modal.close());
    modal.appendChild(closeButton);

    this.root.appendChild(modal);

    // Info button
    addIcon("info-button", "assets/info-solid.svg", () => {
      modal.showModal();
    });

    // Send chat button
    addIcon("chat-button", "assets/comment-solid.svg", () => {
      sendMessage(chatInput);
    });

    settings.appendChild(chatInput);

    this.root.appendChild(settings);
  }

  private paletteInit(setColorCallback: (color: number) => void) {
    const palette = document.createElement("div");
    palette.classList.add("palette");

    const colors = document.createElement("div");
    colors.classList.add("colors");
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
    this.root.appendChild(palette);
  }
}
