import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Basket } from "./components/Models/Basket";
import { BuyerModel } from "./components/Models/BuyerModel";
import { WebLarekAPI } from "./components/Models/WebLarekAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import {
  Modal,
  Header,
  Gallery,
  CardCatalog,
  CardPreview,
  CardBasket,
  OrderForm,
  ContactsForm,
  BasketView,
  Success,
} from "./components/View";
import { IProduct } from "./types";

const events = new EventEmitter();

const catalogModel = new ProductCatalog(events);
const basketModel = new Basket(events);
const buyerModel = new BuyerModel(events);
const api = new WebLarekAPI(CDN_URL, API_URL);

const modalContainer = document.querySelector(
  "#modal-container"
) as HTMLElement;
const headerContainer = document.querySelector(".header") as HTMLElement;
const galleryContainer = document.querySelector(".gallery") as HTMLElement;
const cardCatalogTemplate = document.querySelector(
  "#card-catalog"
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview"
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
  "#card-basket"
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts"
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success"
) as HTMLTemplateElement;

const modal = new Modal(modalContainer);
const header = new Header(headerContainer, () => openBasket());
const gallery = new Gallery(galleryContainer);

events.on<{ products: IProduct[] }>("catalog:changed", ({ products }) => {
  const cards = products.map((product) => {
    const cardElement = cardCatalogTemplate.content
      .querySelector(".card")!
      .cloneNode(true) as HTMLElement;

    const card = new CardCatalog(cardElement, {
      onClick: () => {
        catalogModel.setPreview(product);
      },
    });

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
    });
  });

  gallery.render({ catalog: cards });
});

events.on<{ product: IProduct }>("preview:changed", ({ product }) => {
  const cardElement = cardPreviewTemplate.content
    .querySelector(".card")!
    .cloneNode(true) as HTMLElement;

  const isInBasket = basketModel.contains(product.id);
  const isPriceless = product.price === null;

  const card = new CardPreview(cardElement, () => {
    if (isInBasket) {
      basketModel.remove(product.id);
    } else {
      basketModel.add(product);
    }
    modal.close();
  });

  const buttonText = isPriceless
    ? "Недоступно"
    : isInBasket
    ? "Удалить из корзины"
    : "В корзину";

  modal.render({
    content: card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      buttonText,
      buttonDisabled: isPriceless,
    }),
  });
});

events.on("basket:changed", () => {
  header.render({ counter: basketModel.getCount() });
});

function openBasket(): void {
  const basketElement = basketTemplate.content
    .querySelector(".basket")!
    .cloneNode(true) as HTMLElement;

  const basket = new BasketView(basketElement, () => {
    openOrderForm();
  });

  const basketItems = basketModel.items.map((product, index) => {
    const itemElement = cardBasketTemplate.content
      .querySelector(".basket__item")!
      .cloneNode(true) as HTMLElement;

    const card = new CardBasket(itemElement, () => {
      basketModel.remove(product.id);
      openBasket();
    });

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  modal.render({
    content: basket.render({
      items: basketItems,
      total: basketModel.getTotal(),
    }),
  });

  basket.buttonDisabled = basketModel.getCount() === 0;
}

function openOrderForm(): void {
  const formElement = orderTemplate.content
    .querySelector(".form")!
    .cloneNode(true) as HTMLElement;

  const form = new OrderForm(
    formElement,
    (data) => {
      buyerModel.setField("payment", data.payment);
      buyerModel.setField("address", data.address);
      openContactsForm();
    },
    (data) => {
      const errors: string[] = [];

      if (!data.payment) {
        errors.push("Выберите способ оплаты");
      }

      if (!data.address || data.address.trim() === "") {
        errors.push("Укажите адрес доставки");
      }

      form.render({
        valid: errors.length === 0,
        errors,
      });
    }
  );

  modal.render({ content: formElement });
  form.render({
    valid: false,
    errors: ["Выберите способ оплаты", "Укажите адрес доставки"],
  });
}

function openContactsForm(): void {
  const formElement = contactsTemplate.content
    .querySelector(".form")!
    .cloneNode(true) as HTMLElement;

  const form = new ContactsForm(
    formElement,
    (data) => {
      buyerModel.setField("email", data.email);
      buyerModel.setField("phone", data.phone);
      submitOrder();
    },
    (data) => {
      const errors: string[] = [];

      if (!data.email || data.email.trim() === "") {
        errors.push("Укажите email");
      }

      if (!data.phone || data.phone.trim() === "") {
        errors.push("Укажите телефон");
      }

      form.render({
        valid: errors.length === 0,
        errors,
      });
    }
  );

  modal.render({ content: formElement });
  form.render({
    valid: false,
    errors: ["Укажите email", "Укажите телефон"],
  });
}

function submitOrder(): void {
  const orderData = {
    ...buyerModel.getData(),
    total: basketModel.getTotal(),
    items: basketModel.items.map((item) => item.id),
  };

  api
    .orderProducts(orderData)
    .then((result) => {
      basketModel.clear();
      buyerModel.clear();
      showOrderSuccess(result.total);
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
}

function showOrderSuccess(total: number): void {
  const successElement = successTemplate.content
    .querySelector(".order-success")!
    .cloneNode(true) as HTMLElement;

  const success = new Success(successElement, () => {
    modal.close();
  });

  modal.render({
    content: success.render({ total }),
  });
}

api
  .getProductList()
  .then((products) => {
    catalogModel.setProducts(products);
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога:", error);
  });
