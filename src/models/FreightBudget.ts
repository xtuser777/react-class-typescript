import { AxiosRequestConfig, isAxiosError } from 'axios';
import { City, ICity } from './City';
import { Client, IClient } from './Client';
import { Employee, IEmployee } from './Employee';
import { IFreightItem } from './FreightItem';
import { IRepresentation } from './Representation';
import { ISaleBudget } from './SaleBudget';
import { ITruckType, TruckType } from './TruckType';
import axios from '../services/axios';
import { toast } from 'react-toastify';

export interface IFreightBudget {
  id: number;
  description: string;
  date: string;
  distance: number;
  weight: number;
  value: number;
  shipping: string;
  validate: string;
  saleBudget?: ISaleBudget;
  representation?: IRepresentation;
  client: IClient;
  truckType: ITruckType;
  destiny: ICity;
  author: IEmployee;
  items: IFreightItem[];
}

export class FreightBudget implements IFreightBudget {
  private attributes: IFreightBudget;

  constructor(attributes?: IFreightBudget) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          description: '',
          date: '',
          distance: 0,
          weight: 0.0,
          value: 0.0,
          shipping: '',
          validate: '',
          saleBudget: undefined,
          representation: undefined,
          client: new Client(),
          truckType: new TruckType(),
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

  get distance(): number {
    return this.attributes.distance;
  }
  set distance(v: number) {
    this.attributes.distance = v;
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

  get shipping(): string {
    return this.attributes.shipping;
  }
  set shipping(v: string) {
    this.attributes.shipping = v;
  }

  get validate(): string {
    return this.attributes.validate;
  }
  set validate(v: string) {
    this.attributes.validate = v;
  }

  get saleBudget(): ISaleBudget | undefined {
    return this.attributes.saleBudget;
  }
  set saleBudget(v: ISaleBudget | undefined) {
    this.attributes.saleBudget = v;
  }

  get representation(): IRepresentation | undefined {
    return this.attributes.representation;
  }
  set representation(v: IRepresentation | undefined) {
    this.attributes.representation = v;
  }

  get client(): IClient {
    return this.attributes.client;
  }
  set client(v: IClient) {
    this.attributes.client = v;
  }

  get truckType(): ITruckType {
    return this.attributes.truckType;
  }
  set truckType(v: ITruckType) {
    this.attributes.truckType = v;
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

  get items(): IFreightItem[] {
    return this.attributes.items;
  }
  set items(v: IFreightItem[]) {
    this.attributes.items = v;
  }

  get toAttributes(): IFreightBudget {
    const attributes: IFreightBudget = { ...this.attributes };
    return attributes;
  }

  async save() {
    const payload = {
      budget: {
        date: new Date().toISOString().substring(0, 10),
        description: this.description,
        distance: this.distance,
        weight: this.weight,
        value: this.value,
        shipping: this.shipping,
        validate: this.validate,
        saleBudget: this.saleBudget,
        representation: this.representation,
        client: this.client,
        truckType: this.truckType,
        destiny: this.destiny.id,
        items: this.items,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/freight-budget', payload);
      if (response.data.length == 0) {
        toast.success('Orçamento de frete aberto com sucesso.');
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

  async update() {
    const payload = {
      budget: {
        description: this.description,
        distance: this.distance,
        weight: this.weight,
        value: this.value,
        shipping: this.shipping,
        validate: this.validate,
        saleBudget: this.saleBudget,
        representation: this.representation,
        client: this.client,
        truckType: this.truckType,
        destiny: this.destiny.id,
        items: this.items,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        '/freight-budget/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Orçamento de frete alterado com sucesso.');
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
      const response: AxiosRequestConfig = await axios.delete(
        '/freight-budget/' + this.id,
      );
      if (response.data.length == 0) {
        toast.success('Orçamento de frete removido com sucesso.');
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
      const response = await axios.get('/freight-budget/' + id);
      const budget = response.data ? new FreightBudget(response.data) : undefined;

      return budget;
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get('freight-budget');
      const budgets: IFreightBudget[] = [];
      for (const data of response.data) budgets.push(new FreightBudget(data));

      return budgets;
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return [];
    }
  }
}
