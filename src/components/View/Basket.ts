import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketViewData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this._list = container.querySelector(".basket__list") as HTMLElement;
    this._total = container.querySelector(".basket__price") as HTMLElement;
    this._button = container.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;

    this._button.addEventListener("click", () => {
      this.events.emit("orderForm:open");
    });
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
