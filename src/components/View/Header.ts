import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected _basket: HTMLButtonElement;
  protected _counter: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this._basket = container.querySelector(
      ".header__basket"
    ) as HTMLButtonElement;
    this._counter = container.querySelector(
      ".header__basket-counter"
    ) as HTMLElement;

    this._basket.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}
