import { Component } from "../base/Component";
import { TPayment } from "../../types";
import { IEvents } from "../base/Events";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class FormBase extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this._submit = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    this._errors = container.querySelector(".form__errors") as HTMLElement;

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.onSubmit();
    });
  }

  protected abstract onSubmit(): void;

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string[]) {
    this._errors.textContent = value.join(", ");
  }
}

export class OrderForm extends FormBase {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this._paymentButtons = Array.from(
      container.querySelectorAll(".order__buttons button")
    ) as HTMLButtonElement[];
    this._addressInput = container.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;

    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const target = event.target as HTMLButtonElement;
        const paymentType = target.getAttribute("name") as TPayment;
        this.setPaymentMethod(paymentType);
        this.events.emit("order.payment:change", { value: paymentType });
      });
    });

    this._addressInput.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("order.address:change", { value: target.value });
    });
  }

  protected onSubmit(): void {
    this.events.emit("order:submit");
  }

  setPaymentMethod(payment: TPayment): void {
    this._paymentButtons.forEach((button) => {
      if (button.getAttribute("name") === payment) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
  }

  set payment(value: TPayment | null) {
    if (value) {
      this.setPaymentMethod(value);
    }
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}

export class ContactsForm extends FormBase {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this._emailInput = container.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    this._phoneInput = container.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;

    this._emailInput.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("contacts.email:change", { value: target.value });
    });

    this._phoneInput.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("contacts.phone:change", { value: target.value });
    });
  }

  protected onSubmit(): void {
    this.events.emit("contacts:submit");
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}
