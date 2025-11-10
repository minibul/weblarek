import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Basket } from "./components/Models/Basket";
import { BuyerModel } from "./components/Models/BuyerModel";
import { apiProducts } from "./utils/data";

const events = new EventEmitter();

console.log("=== Тестирование моделей данных ===\n");

console.log("--- Тестирование ProductCatalog ---");

const catalogModel = new ProductCatalog(events);

catalogModel.setProducts(apiProducts.items);
console.log("1. Массив товаров из каталога:", catalogModel.getProducts());
console.log("   Количество товаров:", catalogModel.getProducts().length);

const firstProductId = apiProducts.items[0].id;
const foundProduct = catalogModel.getProduct(firstProductId);
console.log("\n2. Получение товара по ID:", firstProductId);
console.log("   Найденный товар:", foundProduct?.title);

const notFoundProduct = catalogModel.getProduct("non-existent-id");
console.log("\n3. Поиск несуществующего товара:");
console.log("   Результат:", notFoundProduct);

catalogModel.setPreview(apiProducts.items[1]);
const previewProduct = catalogModel.getPreview();
console.log(
  "\n4. Товар для предварительного просмотра:",
  previewProduct?.title
);

console.log("\n");

console.log("--- Тестирование Basket ---");

const basketModel = new Basket(events);

console.log("1. Изначально пустая корзина:", basketModel.getItems());
console.log("   Количество товаров:", basketModel.getCount());
console.log("   Общая стоимость:", basketModel.getTotal(), "синапсов");

basketModel.add(apiProducts.items[0]);
basketModel.add(apiProducts.items[1]);
console.log("\n2. После добавления двух товаров:");
console.log(
  "   Товары в корзине:",
  basketModel.getItems().map((productItem) => productItem.title)
);
console.log("   Количество товаров:", basketModel.getCount());
console.log("   Общая стоимость:", basketModel.getTotal(), "синапсов");

const firstItemId = apiProducts.items[0].id;
console.log("\n3. Проверка наличия товара в корзине:");
console.log(
  '   Товар "' + apiProducts.items[0].title + '" в корзине:',
  basketModel.contains(firstItemId)
);
console.log(
  "   Товар с несуществующим ID в корзине:",
  basketModel.contains("non-existent-id")
);

basketModel.add(apiProducts.items[2]);
console.log("\n4. После добавления товара с ценой null:");
console.log("   Количество товаров:", basketModel.getCount());
console.log(
  "   Общая стоимость:",
  basketModel.getTotal(),
  "синапсов (товар с null не учитывается)"
);

const countBefore = basketModel.getCount();
basketModel.add(apiProducts.items[0]);
console.log("\n5. Попытка добавить тот же товар повторно:");
console.log("   Количество товаров до:", countBefore);
console.log(
  "   Количество товаров после:",
  basketModel.getCount(),
  "(не изменилось)"
);

basketModel.remove(firstItemId);
console.log("\n6. После удаления первого товара:");
console.log(
  "   Товары в корзине:",
  basketModel.getItems().map((productItem) => productItem.title)
);
console.log("   Количество товаров:", basketModel.getCount());
console.log("   Общая стоимость:", basketModel.getTotal(), "синапсов");

basketModel.clear();
console.log("\n7. После очистки корзины:");
console.log("   Товары в корзине:", basketModel.getItems());
console.log("   Количество товаров:", basketModel.getCount());
console.log("   Общая стоимость:", basketModel.getTotal(), "синапсов");

console.log("\n");

console.log("--- Тестирование BuyerModel ---");

const buyerModel = new BuyerModel(events);

console.log("1. Изначальные данные покупателя:", buyerModel.getData());

let validationErrors = buyerModel.validate();
console.log("\n2. Валидация пустых данных:");
console.log("   Ошибки валидации:", validationErrors);
console.log("   Количество ошибок:", Object.keys(validationErrors).length);

buyerModel.setField("payment", "card");
console.log("\n3. После установки способа оплаты:");
console.log("   Способ оплаты:", buyerModel.payment);

buyerModel.setField("address", "Санкт-Петербург, ул. Восстания, д. 1");
buyerModel.setField("email", "test@example.com");
buyerModel.setField("phone", "+79991234567");

console.log("\n4. После заполнения всех полей:");
console.log("   Данные покупателя:", buyerModel.getData());

validationErrors = buyerModel.validate();
console.log("\n5. Валидация заполненных данных:");
console.log("   Ошибки валидации:", validationErrors);
console.log("   Все поля валидны:", Object.keys(validationErrors).length === 0);

buyerModel.clear();
buyerModel.setField("payment", "cash");
buyerModel.setField("address", "Москва, ул. Ленина, д. 10");
validationErrors = buyerModel.validate();
console.log(
  "\n6. Валидация с частично заполненными данными (payment и address):"
);
console.log("   Ошибки валидации:", validationErrors);
console.log("   Поля с ошибками:", Object.keys(validationErrors));

buyerModel.setField("email", "user@mail.ru");
buyerModel.setField("phone", "+79999999999");
console.log("\n7. Данные перед очисткой:", buyerModel.getData());
buyerModel.clear();
console.log("   Данные после очистки:", buyerModel.getData());

console.log("\n");

console.log("=== Все тесты моделей данных выполнены ===");
console.log("Модели данных работают независимо и самостоятельно!");

console.log("\n");

console.log("--- Тестирование WebLarekAPI (работа с сервером) ---");

import { WebLarekAPI } from "./components/Models/WebLarekAPI";
import { API_URL, CDN_URL } from "./utils/constants";

const api = new WebLarekAPI(CDN_URL, API_URL);

const serverCatalog = new ProductCatalog(events);

console.log("1. Выполняем запрос на сервер для получения каталога товаров...");

api
  .getProductList()
  .then((productsFromServer) => {
    console.log("2. Товары успешно получены с сервера!");
    console.log("   Количество товаров:", productsFromServer.length);
    console.log("   Первый товар:", {
      title: productsFromServer[0].title,
      price: productsFromServer[0].price,
      category: productsFromServer[0].category,
    });

    serverCatalog.setProducts(productsFromServer);

    console.log("\n3. Товары сохранены в модель каталога");
    console.log(
      "   Товары из модели каталога:",
      serverCatalog.getProducts().length,
      "шт."
    );

    const firstProductFromCatalog = serverCatalog.getProduct(
      productsFromServer[0].id
    );
    console.log(
      "   Получение товара из каталога по ID работает:",
      firstProductFromCatalog?.title
    );

    console.log("\n4. Полный каталог товаров с сервера:");
    serverCatalog.getProducts().forEach((catalogProduct, productIndex) => {
      console.log(
        `   ${productIndex + 1}. ${catalogProduct.title} - ${
          catalogProduct.price
            ? catalogProduct.price + " синапсов"
            : "Недоступно"
        } (${catalogProduct.category})`
      );
    });

    console.log("\n5. Проверка формирования полных URL для изображений:");
    console.log("   Первое изображение:", productsFromServer[0].image);
    console.log(
      "   Путь начинается с CDN:",
      productsFromServer[0].image.startsWith(CDN_URL)
    );

    console.log("\n=== ✅ Подключение к серверу работает! ===");
    console.log("Класс WebLarekAPI успешно получил данные с сервера");
    console.log("Модель ProductCatalog успешно сохранила данные с сервера");
    console.log("\n🎉 Первая часть проектной работы завершена!");
  })
  .catch((serverError) => {
    console.error("❌ Ошибка при получении данных с сервера:", serverError);
  });
