export class ChatWindow {
  root: HTMLDivElement;
  username: string;
  constructor(root: HTMLDivElement, username: string) {
    this.root = root;
    this.username = username;
    this.init();
  }

  public receiveMessage(username: string, msg: string) {
    const p = document.createElement("p");
    p.innerHTML = `<b>${username}></b> ${msg}`;

    // This deletes the message after the specified times
    const MESSAGE_TIME = 5000;
    const FADE_TIME = 2000;
    // Add fade out after some seconds
    setTimeout(() => {
      p.classList.add("fade-out");
      p.style.animation = `fadeOut ${FADE_TIME}ms ease-out`

    }, MESSAGE_TIME);

    // Delete the element when it is faded out
    // Added -1 because it flashes sometimes lol
    setTimeout(() => {
      p.remove();
    }, MESSAGE_TIME + FADE_TIME - 1);

    this.root.prepend(p);
  }

  public sendMessage(msg: string) {
    this.receiveMessage(this.username, msg);
  }

  private init() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Control") {
        this.root.style.pointerEvents = "auto";
      }
    });
    document.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.key === "Control") {
        this.root.style.pointerEvents = "none";
      }

    })
  }

}
