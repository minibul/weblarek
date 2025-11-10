export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type TPayment = "card" | "cash";

export type TCategory =
  | "софт-скил"
  | "хард-скил"
  | "кнопка"
  | "дополнительное"
  | "другое";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductList {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductCatalog {
  products: IProduct[];
  preview: string | null;
  setProducts(products: IProduct[]): void;
  getProduct(productId: string): IProduct | undefined;
  setPreview(selectedProduct: IProduct): void;
  getPreview(): IProduct | null;
}

export interface IBasket {
  items: IProduct[];
  add(product: IProduct): void;
  remove(productId: string): void;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  contains(productId: string): boolean;
}

export interface IBuyerModel {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
  setField(fieldName: keyof IBuyer, fieldValue: string): void;
  getData(): IBuyer;
  clear(): void;
  validate(): TValidationErrors;
}

export interface IWebLarekAPI {
  getProductList(): Promise<IProduct[]>;
  orderProducts(order: IOrder): Promise<IOrderResult>;
}
