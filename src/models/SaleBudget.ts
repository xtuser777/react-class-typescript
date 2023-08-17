import { AxiosRequestConfig, isAxiosError } from 'axios';
import { IClient } from './Client';
import { Employee, IEmployee } from './Employee';
import { ISaleItem } from './SaleItem';
import { City, ICity } from './City';
import axios from '../services/axios';
import { toast } from 'react-toastify';

export interface ISaleBudget {
  id: number;
  description: string;
  date: string;
  clientName: string;
  clientDocument: string;
  clientPhone: string;
  clientCellphone: string;
  clientEmail: string;
  weight: number;
  value: number;
  validate: string;
  salesman?: IEmployee;
  client?: IClient;
  destiny: ICity;
  author: IEmployee;
  items: ISaleItem[];
}

export class SaleBudget implements ISaleBudget {
  private attributes: ISaleBudget;

  constructor(attributes?: ISaleBudget) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          description: '',
          date: '',
          clientName: '',
          clientDocument: '',
          clientPhone: '',
          clientCellphone: '',
          clientEmail: '',
          weight: 0.0,
          value: 0.0,
          validate: '',
          salesman: undefined,
          client: undefined,
          destiny: new City(),
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

  get clientName(): string {
    return this.attributes.clientName;
  }
  set clientName(v: string) {
    this.attributes.clientName = v;
  }

  get clientDocument(): string {
    return this.attributes.clientDocument;
  }
  set clientDocument(v: string) {
    this.attributes.clientDocument = v;
  }

  get clientPhone(): string {
    return this.attributes.clientPhone;
  }
  set clientPhone(v: string) {
    this.attributes.clientPhone = v;
  }

  get clientCellphone(): string {
    return this.attributes.clientCellphone;
  }
  set clientCellphone(v: string) {
    this.attributes.clientCellphone = v;
  }

  get clientEmail(): string {
    return this.attributes.clientEmail;
  }
  set clientEmail(v: string) {
    this.attributes.clientEmail = v;
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

  get validate(): string {
    return this.attributes.validate;
  }
  set validate(v: string) {
    this.attributes.validate = v;
  }

  get salesman(): IEmployee | undefined {
    return this.attributes.salesman;
  }
  set salesman(v: IEmployee | undefined) {
    this.attributes.salesman = v;
  }

  get client(): IClient | undefined {
    return this.attributes.client;
  }
  set client(v: IClient | undefined) {
    this.attributes.client = v;
  }

  get destiny(): ICity {
    return this.attributes.destiny;
  }
  set destiny(v: ICity) {
    this.attributes.destiny = v;
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

  get toAttributes(): ISaleBudget {
    const attributes: ISaleBudget = { ...this.attributes };
    return attributes;
  }

  save = async () => {
    const payload = {
      budget: {
        date: new Date().toISOString().substring(0, 10),
        description: this.description,
        clientName: this.clientName,
        clientDocument: this.clientDocument,
        clientPhone: this.clientPhone,
        clientCellphone: this.clientCellphone,
        clientEmail: this.clientEmail,
        weight: this.weight,
        value: this.value,
        validate: this.validate,
        salesman: this.salesman,
        client: this.client,
        destiny: this.destiny.id,
        items: this.items,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/sale-budget', payload);
      if (response.data.length == 0) {
        toast.success('Orçamento de venda aberto com sucesso.');
        return true;
      } else {
        toast.error('Erro: ' + response.data);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  };

  async update() {
    const payload = {
      budget: {
        description: this.description,
        clientName: this.clientName,
        clientDocument: this.clientDocument,
        clientPhone: this.clientPhone,
        clientCellphone: this.clientCellphone,
        clientEmail: this.clientEmail,
        weight: this.weight,
        value: this.value,
        validate: this.validate,
        salesman: this.salesman,
        client: this.client,
        destiny: this.destiny,
        items: this.items,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        '/sale-budget/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Orçamento de venda alterado com sucesso.');
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
      const response: AxiosRequestConfig = await axios.delete('/sale-budget/' + this.id);
      if (response.data.length == 0) {
        toast.success('Orçamento de venda excluído com sucesso.');
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
      const response = await axios.get('/sale-budget/' + id);
      const budget = response.data ? new SaleBudget(response.data) : undefined;

      return budget;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get('/sale-budget');
      const budgets: SaleBudget[] = [];
      for (const data of response.data) budgets.push(new SaleBudget(data));

      return budgets;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
