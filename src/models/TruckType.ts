import { toast } from 'react-toastify';
import axios from '../services/axios';
import { AxiosRequestConfig, isAxiosError } from 'axios';

export interface ITruckType {
  id: number;
  description: string;
  axes: number;
  capacity: number;
}

export class TruckType implements ITruckType {
  private attributes: ITruckType;
  constructor(attributes?: ITruckType) {
    this.attributes = attributes
      ? attributes
      : { id: 0, description: '', axes: 0, capacity: 0.0 };
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

  get axes(): number {
    return this.attributes.axes;
  }
  set axes(v: number) {
    this.attributes.axes = v;
  }

  get capacity(): number {
    return this.attributes.capacity;
  }
  set capacity(v: number) {
    this.attributes.capacity = v;
  }

  get toAttributes(): ITruckType {
    const attributes: ITruckType = { ...this.attributes };
    return attributes;
  }

  save = async () => {
    const payload = {
      type: {
        description: this.description,
        axes: this.axes,
        capacity: this.capacity,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/type', payload);
      if (response.data.length == 0) {
        toast.success('Tipo de caminhão cadastrado com sucesso!');
        return true;
      } else {
        toast.error(`Erro: ${response.data}`);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  };

  update = async () => {
    const payload = {
      type: {
        description: this.description,
        axes: this.axes,
        capacity: this.capacity,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put('/type/' + this.id, payload);
      if (response.data.length == 0) {
        toast.success('Tipo de caminhão atualizado com sucesso!');
        return true;
      } else {
        toast.error(`Erro: ${response.data}`);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  };

  delete = async () => {
    try {
      const response: AxiosRequestConfig = await axios.delete('/type/' + this.id);
      if (response.data.length == 0) {
        toast.success('Tipo de caminhão removido com sucesso!');
        return true;
      } else {
        toast.error(`Erro: ${response.data}`);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  };

  async getOne(id: number) {
    try {
      const response = await axios.get(`/type/${id}`);
      const type = response.data ? new TruckType(response.data) : undefined;

      return type;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get(`/type`);
      const types: TruckType[] = [];
      for (const data of response.data) types.push(new TruckType(data));

      return types;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
