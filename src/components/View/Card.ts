import { Component } from "../base/Component";
import { TCategory } from "../../types";
import { categoryMap } from "../../utils/constants";

interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export abstract class CardBase<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = container.querySelector(".card__title") as HTMLElement;
    this._price = container.querySelector(".card__price") as HTMLElement;

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value !== null ? `${value} синапсов` : "Бесценно";
  }
}

interface ICardCatalogData {
  title: string;
  price: number | null;
  category: TCategory;
  image: string;
}

export class CardCatalog extends CardBase<ICardCatalogData> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    this._category = container.querySelector(".card__category") as HTMLElement;
    this._image = container.querySelector(".card__image") as HTMLImageElement;
  }

  set category(value: TCategory) {
    this._category.textContent = value;
    this._category.className = "card__category";
    const categoryClass = categoryMap[value];
    if (categoryClass) {
      this._category.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    this.setImage(this._image, value, this._title.textContent || "");
  }
}

interface ICardPreviewData {
  title: string;
  price: number | null;
  category: TCategory;
  image: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends CardBase<ICardPreviewData> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _onButtonClick?: () => void;

  constructor(container: HTMLElement, onButtonClick?: () => void) {
    super(container);
    this._onButtonClick = onButtonClick;

    this._category = container.querySelector(".card__category") as HTMLElement;
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._description = container.querySelector(".card__text") as HTMLElement;
    this._button = container.querySelector(
      ".card__button"
    ) as HTMLButtonElement;

    if (this._button && this._onButtonClick) {
      this._button.addEventListener("click", () => {
        this._onButtonClick!();
      });
    }
  }

  set category(value: TCategory) {
    this._category.textContent = value;
    this._category.className = "card__category";
    const categoryClass = categoryMap[value];
    if (categoryClass) {
      this._category.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    this.setImage(this._image, value, this._title.textContent || "");
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }
}

interface ICardBasketData {
  title: string;
  price: number | null;
  index: number;
}

export class CardBasket extends CardBase<ICardBasketData> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;
  protected _onDelete?: () => void;

  constructor(container: HTMLElement, onDelete?: () => void) {
    super(container);
    this._onDelete = onDelete;

    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._deleteButton = container.querySelector(
      ".basket__item-delete"
    ) as HTMLButtonElement;

    if (this._deleteButton && this._onDelete) {
      this._deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        this._onDelete!();
      });
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
