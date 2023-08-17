import { City, ICity } from './City';

export interface IAddress {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  code: string;
  city: ICity;
}

export class Address implements IAddress {
  private attributes: IAddress;

  constructor(attributes?: IAddress) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          street: '',
          number: '',
          neighborhood: '',
          complement: '',
          code: '',
          city: new City(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get street(): string {
    return this.attributes.street;
  }
  set street(v: string) {
    this.attributes.street = v;
  }

  get number(): string {
    return this.attributes.number;
  }
  set number(v: string) {
    this.attributes.number = v;
  }

  get neighborhood(): string {
    return this.attributes.neighborhood;
  }
  set neighborhood(v: string) {
    this.attributes.neighborhood = v;
  }

  get complement(): string {
    return this.attributes.complement;
  }
  set complement(v: string) {
    this.attributes.complement = v;
  }

  get code(): string {
    return this.attributes.code;
  }
  set code(v: string) {
    this.attributes.code = v;
  }

  get city(): ICity {
    return this.attributes.city;
  }
  set city(v: ICity) {
    this.attributes.city = v;
  }

  get toAttributes(): IAddress {
    const attributes: IAddress = { ...this.attributes };
    return attributes;
  }
}
