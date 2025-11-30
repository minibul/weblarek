import { Component } from "../base/Component";
import { TPayment } from "../../types";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class FormBase<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _onSubmit?: (data: T) => void;

  constructor(container: HTMLElement, onSubmit?: (data: T) => void) {
    super(container);
    this._onSubmit = onSubmit;

    this._submit = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    this._errors = container.querySelector(".form__errors") as HTMLElement;

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this._onSubmit) {
        this._onSubmit(this.getFormData());
      }
    });
  }

  protected abstract getFormData(): T;

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string[]) {
    this._errors.textContent = value.join(", ");
  }

  clear(): void {
    (this.container as HTMLFormElement).reset();
  }
}

interface IOrderFormData {
  payment: TPayment;
  address: string;
}

export class OrderForm extends FormBase<IOrderFormData> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;
  protected _selectedPayment: TPayment | null = null;
  protected _onInputChange?: (data: Partial<IOrderFormData>) => void;

  constructor(
    container: HTMLElement,
    onSubmit?: (data: IOrderFormData) => void,
    onInputChange?: (data: Partial<IOrderFormData>) => void
  ) {
    super(container, onSubmit);
    this._onInputChange = onInputChange;

    this._paymentButtons = Array.from(
      container.querySelectorAll(".order__buttons button")
    ) as HTMLButtonElement[];
    this._addressInput = container.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;

    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const paymentType = button.getAttribute("name") as TPayment;
        this.setPaymentMethod(paymentType);
        if (this._onInputChange) {
          this._onInputChange(this.getFormData());
        }
      });
    });

    this._addressInput.addEventListener("input", () => {
      if (this._onInputChange) {
        this._onInputChange(this.getFormData());
      }
    });
  }

  setPaymentMethod(payment: TPayment): void {
    this._selectedPayment = payment;
    this._paymentButtons.forEach((button) => {
      if (button.getAttribute("name") === payment) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
  }

  protected getFormData(): IOrderFormData {
    return {
      payment: this._selectedPayment as TPayment,
      address: this._addressInput.value,
    };
  }

  clear(): void {
    super.clear();
    this._selectedPayment = null;
    this._paymentButtons.forEach((button) => {
      button.classList.remove("button_alt-active");
    });
  }
}

interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends FormBase<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _onInputChange?: (data: Partial<IContactsFormData>) => void;

  constructor(
    container: HTMLElement,
    onSubmit?: (data: IContactsFormData) => void,
    onInputChange?: (data: Partial<IContactsFormData>) => void
  ) {
    super(container, onSubmit);
    this._onInputChange = onInputChange;

    this._emailInput = container.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    this._phoneInput = container.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;

    this._emailInput.addEventListener("input", () => {
      if (this._onInputChange) {
        this._onInputChange(this.getFormData());
      }
    });

    this._phoneInput.addEventListener("input", () => {
      if (this._onInputChange) {
        this._onInputChange(this.getFormData());
      }
    });
  }

  protected getFormData(): IContactsFormData {
    return {
      email: this._emailInput.value,
      phone: this._phoneInput.value,
    };
  }
}
