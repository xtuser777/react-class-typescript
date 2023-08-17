import axios from '../services/axios';
import { IEmployee, Employee } from './Employee';
import { IFreightOrder } from './FreightOrder';
import { ISaleOrder } from './SaleOrder';

export interface IEvent {
  id: number;
  description: string;
  date: string;
  time: string;
  saleOrder?: ISaleOrder;
  freightOrder?: IFreightOrder;
  author: IEmployee;
}

export class Event implements IEvent {
  private attributes: IEvent;

  constructor(attributes?: IEvent) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          description: '',
          date: '',
          time: '',
          author: new Employee(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }
  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }
  get date(): string {
    return this.attributes.date;
  }
  set date(v: string) {
    this.attributes.date = v;
  }
  get time(): string {
    return this.attributes.time;
  }
  set time(v: string) {
    this.attributes.time = v;
  }
  get saleOrder(): ISaleOrder | undefined {
    return this.attributes.saleOrder;
  }
  set saleOrder(v: ISaleOrder | undefined) {
    this.attributes.saleOrder = v;
  }
  get freightOrder(): IFreightOrder | undefined {
    return this.attributes.freightOrder;
  }
  set freightOrder(v: IFreightOrder | undefined) {
    this.attributes.freightOrder = v;
  }
  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }
  get toAttributes(): IEvent {
    const attributes: IEvent = { ...this.attributes };
    return attributes;
  }

  async getOne(id: number) {
    if (id <= 0) return undefined;
    try {
      const response = await axios.get('/event/' + id);
      return response.data ? new Event(response.data) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get('/event');
      const events: Event[] = [];
      for (const data of response.data) events.push(new Event(data));
      return events;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
