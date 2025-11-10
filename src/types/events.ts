export const CATALOG_EVENTS = {
  CHANGED: "catalog:changed",
  PREVIEW_CHANGED: "preview:changed",
} as const;

export const BASKET_EVENTS = {
  CHANGED: "basket:changed",
} as const;

export const BUYER_EVENTS = {
  CHANGED: "buyer:changed",
  CLEARED: "buyer:cleared",
} as const;

export interface ICatalogChangedEvent {
  products: unknown[];
}

export interface IPreviewChangedEvent {
  product: unknown;
}

export interface IBasketChangedEvent {
  items: unknown[];
}

export interface IBuyerChangedEvent {
  field: string;
  value: string;
}
