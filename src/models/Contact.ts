import { Address, IAddress } from './Address';

export interface IContact {
  id: number;
  phone: string;
  cellphone: string;
  email: string;
  address: IAddress;
}

export class Contact implements IContact {
  private attributes: IContact;

  constructor(attributes?: IContact) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          phone: '',
          cellphone: '',
          email: '',
          address: new Address(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get phone(): string {
    return this.attributes.phone;
  }
  set phone(v: string) {
    this.attributes.phone = v;
  }

  get cellphone(): string {
    return this.attributes.cellphone;
  }
  set cellphone(v: string) {
    this.attributes.cellphone = v;
  }

  get email(): string {
    return this.attributes.email;
  }
  set email(v: string) {
    this.attributes.email = v;
  }

  get address(): IAddress {
    return this.attributes.address;
  }
  set address(v: IAddress) {
    this.attributes.address = v;
  }

  get toAttributes(): IContact {
    const attributes: IContact = { ...this.attributes };
    return attributes;
  }
}
