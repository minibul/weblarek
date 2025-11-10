import { Api } from "../base/Api";
import {
  IProduct,
  IProductList,
  IOrder,
  IOrderResult,
  IWebLarekAPI,
} from "../../types";

export class WebLarekAPI extends Api implements IWebLarekAPI {
  protected cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  async getProductList(): Promise<IProduct[]> {
    const productListResponse = await this.get<IProductList>("/product");
    return productListResponse.items.map((productItem) => ({
      ...productItem,
      image: this.cdn + productItem.image,
    }));
  }

  async getProduct(productId: string): Promise<IProduct> {
    const productData = await this.get<IProduct>(`/product/${productId}`);
    return {
      ...productData,
      image: this.cdn + productData.image,
    };
  }

  async orderProducts(order: IOrder): Promise<IOrderResult> {
    return await this.post<IOrderResult>("/order", order);
  }
}
