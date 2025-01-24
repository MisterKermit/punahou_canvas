import { ChatMessage } from "../../lib";

export class ChatWindow {
  root: HTMLDivElement;
  username: string;
  socket: WebSocket;
  // add a socket object here
  constructor(root: HTMLDivElement, username: string, socket: WebSocket) {
    this.root = root;
    this.username = username;
    this.socket = socket;
    this.init();
  }

  /**
   * Adds a message to the chat window
   */
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


  /**
   * Sends a message into the chat
   */
  public sendMessage(msg: string) {
    this.receiveMessage(this.username, msg);
    const message: ChatMessage = {
      type: "chatMessage",
      message: msg
    };
    this.socket.send(JSON.stringify(message));
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
