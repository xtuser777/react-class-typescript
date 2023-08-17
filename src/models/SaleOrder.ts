import { AxiosRequestConfig, isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { City, ICity } from './City';
import { Client, IClient } from './Client';
import { Employee, IEmployee } from './Employee';
import { IPaymentForm, PaymentForm } from './PaymentForm';
import { ISaleBudget } from './SaleBudget';
import { ISaleItem } from './SaleItem';
import axios from '../services/axios';
import { Comission } from '../pages/SalesOrder';

export interface ISaleOrder {
  id: number;
  date: string;
  description: string;
  weight: number;
  value: number;
  salesman?: IEmployee;
  destiny: ICity;
  budget?: ISaleBudget;
  client: IClient;
  paymentForm: IPaymentForm;
  author: IEmployee;
  items: ISaleItem[];
}

export class SaleOrder implements ISaleOrder {
  private attributes: ISaleOrder;

  constructor(attributes?: ISaleOrder) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          description: '',
          weight: 0.0,
          value: 0.0,
          salesman: undefined,
          budget: undefined,
          destiny: new City(),
          client: new Client(),
          paymentForm: new PaymentForm(),
          author: new Employee(),
          items: [],
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get date(): string {
    return this.attributes.date;
  }
  set date(v: string) {
    this.attributes.date = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get weight(): number {
    return this.attributes.weight;
  }
  set weight(v: number) {
    this.attributes.weight = v;
  }

  get value(): number {
    return this.attributes.value;
  }
  set value(v: number) {
    this.attributes.value = v;
  }

  get salesman(): IEmployee | undefined {
    return this.attributes.salesman;
  }
  set salesman(v: IEmployee | undefined) {
    this.attributes.salesman = v;
  }

  get budget(): ISaleBudget | undefined {
    return this.attributes.budget;
  }
  set budget(v: ISaleBudget | undefined) {
    this.attributes.budget = v;
  }

  get destiny(): ICity {
    return this.attributes.destiny;
  }
  set destiny(v: ICity) {
    this.attributes.destiny = v;
  }

  get client(): IClient {
    return this.attributes.client;
  }
  set client(v: IClient) {
    this.attributes.client = v;
  }

  get paymentForm(): IPaymentForm {
    return this.attributes.paymentForm;
  }
  set paymentForm(v: IPaymentForm) {
    this.attributes.paymentForm = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get items(): ISaleItem[] {
    return this.attributes.items;
  }
  set items(v: ISaleItem[]) {
    this.attributes.items = v;
  }

  get toAttributes(): ISaleOrder {
    const attributes: ISaleOrder = { ...this.attributes };
    return attributes;
  }

  async save(comissions: Comission[], salesmanComissionPorcent?: number) {
    const payload = {
      order: {
        date: new Date().toISOString().substring(0, 10),
        description: this.description,
        weight: this.weight,
        value: this.value,
        budget: this.budget,
        salesman: this.salesman,
        salesmanComissionPorcent: salesmanComissionPorcent,
        client: this.client,
        paymentForm: this.paymentForm,
        destiny: this.destiny,
        items: this.items,
        comissions: comissions,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/sale-order', payload);
      if (response.data.length == 0) {
        toast.success('Pedido de venda aberto com sucesso.');
        return true;
      } else {
        toast.error('Erro: ' + response.data);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  }

  async delete() {
    try {
      const response: AxiosRequestConfig = await axios.delete('/sale-order/' + this.id);
      console.log(response);

      if (response.data.length == 0) {
        toast.success('Pedido de venda removido com sucesso.');
        return true;
      } else {
        toast.error('Erro: ' + response.data);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  }

  async getOne(id: number) {
    if (id <= 0) return undefined;
    try {
      const response = await axios.get('/sale-order/' + id);
      const order = response.data ? new SaleOrder(response.data) : undefined;

      return order;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get('/sale-order');
      const orders: SaleOrder[] = [];
      for (const data of response.data) orders.push(new SaleOrder(data));

      return orders;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
