import { Component } from "../base/Component";

interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;
  protected _onClose?: () => void;

  constructor(container: HTMLElement, onClose?: () => void) {
    super(container);
    this._onClose = onClose;

    this._description = container.querySelector(
      ".order-success__description"
    ) as HTMLElement;
    this._closeButton = container.querySelector(
      ".order-success__close"
    ) as HTMLButtonElement;

    if (this._closeButton && this._onClose) {
      this._closeButton.addEventListener("click", () => {
        this._onClose!();
      });
    }
  }

  set total(value: number) {
    this._description.textContent = `Списано ${value} синапсов`;
  }
}
