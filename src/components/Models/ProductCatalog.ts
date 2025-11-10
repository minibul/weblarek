import { IProduct, IProductCatalog } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalog implements IProductCatalog {
  protected _products: IProduct[] = [];
  protected _preview: string | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  get products(): IProduct[] {
    return this._products;
  }

  get preview(): string | null {
    return this._preview;
  }

  setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit("catalog:changed", { products: this._products });
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProduct(productId: string): IProduct | undefined {
    return this._products.find(
      (catalogProduct) => catalogProduct.id === productId
    );
  }

  setPreview(selectedProduct: IProduct): void {
    this._preview = selectedProduct.id;
    this.events.emit("preview:changed", { product: selectedProduct });
  }

  getPreview(): IProduct | null {
    if (!this._preview) {
      return null;
    }
    return this.getProduct(this._preview) || null;
  }
}
