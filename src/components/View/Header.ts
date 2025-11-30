import { Component } from "../base/Component";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected _basket: HTMLButtonElement;
  protected _counter: HTMLElement;
  protected _onBasketClick?: () => void;

  constructor(container: HTMLElement, onBasketClick?: () => void) {
    super(container);
    this._onBasketClick = onBasketClick;

    this._basket = container.querySelector(
      ".header__basket"
    ) as HTMLButtonElement;
    this._counter = container.querySelector(
      ".header__basket-counter"
    ) as HTMLElement;

    if (this._basket && this._onBasketClick) {
      this._basket.addEventListener("click", () => {
        this._onBasketClick!();
      });
    }
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}
