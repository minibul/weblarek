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

const cloneCardCatalog = () =>
  cardCatalogTemplate.content
    .querySelector(".card")!
    .cloneNode(true) as HTMLElement;
const cloneCardPreview = () =>
  cardPreviewTemplate.content
    .querySelector(".card")!
    .cloneNode(true) as HTMLElement;
const cloneCardBasket = () =>
  cardBasketTemplate.content
    .querySelector(".basket__item")!
    .cloneNode(true) as HTMLElement;
const cloneBasket = () =>
  basketTemplate.content
    .querySelector(".basket")!
    .cloneNode(true) as HTMLElement;
const cloneOrderForm = () =>
  orderTemplate.content.querySelector(".form")!.cloneNode(true) as HTMLElement;
const cloneContactsForm = () =>
  contactsTemplate.content
    .querySelector(".form")!
    .cloneNode(true) as HTMLElement;
const cloneSuccess = () =>
  successTemplate.content
    .querySelector(".order-success")!
    .cloneNode(true) as HTMLElement;

const modal = new Modal(modalContainer);
const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const basketElement = cloneBasket();
const basket = new BasketView(events, basketElement);
const orderFormElement = cloneOrderForm();
const orderForm = new OrderForm(events, orderFormElement);
const contactsFormElement = cloneContactsForm();
const contactsForm = new ContactsForm(events, contactsFormElement);

const validateOrderForm = () => {
  const validationErrors = buyerModel.validate();
  const errors: string[] = [];

  if (validationErrors.payment) {
    errors.push(validationErrors.payment);
  }
  if (validationErrors.address) {
    errors.push(validationErrors.address);
  }

  orderForm.render({
    valid: errors.length === 0,
    errors,
  });
};

const validateContactsForm = () => {
  const validationErrors = buyerModel.validate();
  const errors: string[] = [];

  if (validationErrors.email) {
    errors.push(validationErrors.email);
  }
  if (validationErrors.phone) {
    errors.push(validationErrors.phone);
  }

  contactsForm.render({
    valid: errors.length === 0,
    errors,
  });
};

events.on("buyer:changed", () => {
  validateOrderForm();
  validateContactsForm();
});

events.on<{ products: IProduct[] }>("catalog:changed", ({ products }) => {
  const cards = products.map((product) => {
    const cardElement = cloneCardCatalog();

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
  const cardElement = cloneCardPreview();

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

events.on<{ value: string }>("order.payment:change", ({ value }) => {
  buyerModel.setField("payment", value);
});

events.on<{ value: string }>("order.address:change", ({ value }) => {
  buyerModel.setField("address", value);
});

events.on("order:submit", () => {
  events.emit("contacts:open");
});

events.on<{ value: string }>("contacts.email:change", ({ value }) => {
  buyerModel.setField("email", value);
});

events.on<{ value: string }>("contacts.phone:change", ({ value }) => {
  buyerModel.setField("phone", value);
});

events.on("contacts:submit", () => {
  events.emit("order:submit:final");
});

events.on("basket:open", () => {
  const basketItems = basketModel.items.map((product, index) => {
    const itemElement = cloneCardBasket();

    const card = new CardBasket(itemElement, () => {
      basketModel.remove(product.id);
      events.emit("basket:open");
    });

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basket.render({
    items: basketItems,
    total: basketModel.getTotal(),
  });

  basket.buttonDisabled = basketModel.getCount() === 0;

  modal.render({
    content: basketElement,
  });
});

events.on("orderForm:open", () => {
  orderForm.payment = buyerModel.payment;
  orderForm.address = buyerModel.address;

  modal.render({ content: orderFormElement });
  validateOrderForm();
});

events.on("contacts:open", () => {
  contactsForm.email = buyerModel.email;
  contactsForm.phone = buyerModel.phone;

  modal.render({ content: contactsFormElement });
  validateContactsForm();
});

events.on("order:submit:final", () => {
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
      events.emit("order:success", { total: result.total });
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
});

events.on<{ total: number }>("order:success", ({ total }) => {
  const successElement = cloneSuccess();

  const success = new Success(successElement, () => {
    modal.close();
  });

  modal.render({
    content: success.render({ total }),
  });
});

api
  .getProductList()
  .then((products) => {
    catalogModel.setProducts(products);
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога:", error);
  });
