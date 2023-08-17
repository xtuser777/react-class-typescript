import { toast } from 'react-toastify';
import axios from '../services/axios';
import { IEmployee, Employee } from './Employee';
import { IStatus, Status } from './Status';
import { isAxiosError } from 'axios';

export interface IOrderStatus {
  id: number;
  status: IStatus;
  date: string;
  time: string;
  observation: string;
  author: IEmployee;
}

export class OrderStatus implements IOrderStatus {
  private attributes: IOrderStatus;

  constructor(attributes?: IOrderStatus) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          time: '',
          observation: '',
          status: new Status(),
          author: new Employee(),
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

  get time(): string {
    return this.attributes.time;
  }
  set time(v: string) {
    this.attributes.time = v;
  }

  get observation(): string {
    return this.attributes.observation;
  }
  set observation(v: string) {
    this.attributes.observation = v;
  }

  get status(): IStatus {
    return this.attributes.status;
  }
  set status(v: IStatus) {
    this.attributes.status = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get toAttributes(): IOrderStatus {
    const attributes: IOrderStatus = { ...this.attributes };
    return attributes;
  }

  async update(id: number) {
    const payload = {
      status: {
        date: this.date,
        time: this.time,
        status: this.status,
        observation: this.observation,
      },
    };

    try {
      const response = await axios.put('/order-status/' + id, payload);
      if (response.data.length == 0) {
        toast.success('Status do pedido atualizado com sucesso!');
        return true;
      } else {
        toast.error(`Erro: ${response.data}`);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  }
}
