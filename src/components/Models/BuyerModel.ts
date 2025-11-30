import { IBuyer, IBuyerModel, TPayment, TValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel implements IBuyerModel {
  protected _payment: TPayment | null = null;
  protected _email: string = "";
  protected _phone: string = "";
  protected _address: string = "";
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  get payment(): TPayment | null {
    return this._payment;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get address(): string {
    return this._address;
  }

  setField(fieldName: keyof IBuyer, fieldValue: string): void {
    switch (fieldName) {
      case "payment":
        this._payment = fieldValue as TPayment;
        break;
      case "email":
        this._email = fieldValue;
        break;
      case "phone":
        this._phone = fieldValue;
        break;
      case "address":
        this._address = fieldValue;
        break;
    }
    this.events.emit("buyer:changed", { field: fieldName, value: fieldValue });
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._email = "";
    this._phone = "";
    this._address = "";
    this.events.emit("buyer:cleared");
  }

  validate(): TValidationErrors {
    const validationErrors: TValidationErrors = {};

    if (!this._payment) {
      validationErrors.payment = "Не выбран способ оплаты";
    }

    if (!this._address || this._address.trim() === "") {
      validationErrors.address = "Не указан адрес доставки";
    }

    if (!this._email || this._email.trim() === "") {
      validationErrors.email = "Не указан email";
    }

    if (!this._phone || this._phone.trim() === "") {
      validationErrors.phone = "Не указан телефон";
    }

    return validationErrors;
  }
}
