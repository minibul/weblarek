import { IProduct, IBasket } from "../../types";
import { IEvents } from "../base/Events";

export class Basket implements IBasket {
  protected _items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  get items(): IProduct[] {
    return this._items;
  }

  add(product: IProduct): void {
    if (!this.contains(product.id)) {
      this._items.push(product);
      this.events.emit("basket:changed", { items: this._items });
    }
  }

  remove(productId: string): void {
    const productIndex = this._items.findIndex(
      (basketItem) => basketItem.id === productId
    );
    if (productIndex !== -1) {
      this._items.splice(productIndex, 1);
      this.events.emit("basket:changed", { items: this._items });
    }
  }

  clear(): void {
    this._items = [];
    this.events.emit("basket:changed", { items: this._items });
  }

  getTotal(): number {
    return this._items.reduce((accumulatedTotal, basketItem) => {
      return accumulatedTotal + (basketItem.price || 0);
    }, 0);
  }

  getCount(): number {
    return this._items.length;
  }

  contains(productId: string): boolean {
    return this._items.some((basketItem) => basketItem.id === productId);
  }
}
