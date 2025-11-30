import { Component } from "../base/Component";

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketViewData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _onCheckout?: () => void;

  constructor(container: HTMLElement, onCheckout?: () => void) {
    super(container);
    this._onCheckout = onCheckout;

    this._list = container.querySelector(".basket__list") as HTMLElement;
    this._total = container.querySelector(".basket__price") as HTMLElement;
    this._button = container.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;

    if (this._button && this._onCheckout) {
      this._button.addEventListener("click", () => {
        this._onCheckout!();
      });
    }
  }

  set items(items: HTMLElement[]) {
    if (items.length > 0) {
      this._list.replaceChildren(...items);
    } else {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Корзина пуста";
      emptyMessage.style.textAlign = "center";
      emptyMessage.style.padding = "20px";
      this._list.replaceChildren(emptyMessage);
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }
}
