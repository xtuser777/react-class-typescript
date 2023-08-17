import { IProduct, Product } from './Product';
import { ISaleBudget } from './SaleBudget';
import { ISaleOrder } from './SaleOrder';

export interface ISaleItem {
  id: number;
  quantity: number;
  weight: number;
  price: number;
  product: IProduct;
  budget?: ISaleBudget;
  order?: ISaleOrder;
}

export class SaleItem {
  private attributes: ISaleItem;

  constructor(attributes?: ISaleItem) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          product: new Product(),
          quantity: 0,
          weight: 0.0,
          price: 0.0,
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get quantity(): number {
    return this.attributes.quantity;
  }
  set quantity(v: number) {
    this.attributes.quantity = v;
  }

  get weight(): number {
    return this.attributes.weight;
  }
  set weight(v: number) {
    this.attributes.weight = v;
  }

  get price(): number {
    return this.attributes.price;
  }
  set price(v: number) {
    this.attributes.price = v;
  }

  get product(): IProduct {
    return this.attributes.product;
  }
  set product(v: IProduct) {
    this.attributes.product = v;
  }

  get budget(): ISaleBudget | undefined {
    return this.attributes.budget;
  }
  set budget(v: ISaleBudget | undefined) {
    this.attributes.budget = v;
  }

  get order(): ISaleOrder | undefined {
    return this.attributes.order;
  }
  set order(v: ISaleOrder | undefined) {
    this.attributes.order = v;
  }

  get toAttributes(): ISaleItem {
    const attributes: ISaleItem = { ...this.attributes };
    return attributes;
  }
}
