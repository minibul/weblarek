import { Component } from "../base/Component";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _onClose?: () => void;

  constructor(container: HTMLElement, onClose?: () => void) {
    super(container);
    this._onClose = onClose;

    this._closeButton = container.querySelector(
      ".modal__close"
    ) as HTMLButtonElement;
    this._content = container.querySelector(".modal__content") as HTMLElement;

    this._closeButton.addEventListener("click", this.close.bind(this));

    container.addEventListener("click", (event) => {
      if (event.target === container) {
        this.close();
      }
    });

    this._handleEscUp = this._handleEscUp.bind(this);
  }

  protected _handleEscUp(evt: KeyboardEvent): void {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
    document.addEventListener("keyup", this._handleEscUp);
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.content = document.createElement("div");
    document.removeEventListener("keyup", this._handleEscUp);

    if (this._onClose) {
      this._onClose();
    }
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
