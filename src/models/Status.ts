import { isAxiosError } from 'axios';
import axios from '../services/axios';
import { toast } from 'react-toastify';

export interface IStatus {
  id: number;
  description: string;
}

export class Status implements IStatus {
  private attributes: IStatus;

  constructor(attributes?: IStatus) {
    this.attributes = attributes ? attributes : { id: 0, description: '' };
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

  get toAttributes(): IStatus {
    const attributes: IStatus = { ...this.attributes };
    return attributes;
  }

  async get() {
    try {
      const response = await axios.get('/status');
      const statuses: Status[] = [];
      for (const data of response.data) statuses.push(new Status(data));
      return statuses;
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return [];
    }
  }
}
