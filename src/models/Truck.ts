import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { IProprietary, Proprietary } from './Proprietary';
import { ITruckType, TruckType } from './TruckType';
import { toast } from 'react-toastify';

export interface ITruck {
  id: number;
  plate: string;
  brand: string;
  model: string;
  color: string;
  manufactureYear: number;
  modelYear: number;
  type: ITruckType;
  proprietary: IProprietary;
}

export class Truck implements ITruck {
  private attributes: ITruck;

  constructor(attributes?: ITruck) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          plate: '',
          brand: '',
          model: '',
          color: '',
          manufactureYear: 0,
          modelYear: 0,
          type: new TruckType(),
          proprietary: new Proprietary(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get plate(): string {
    return this.attributes.plate;
  }
  set plate(v: string) {
    this.attributes.plate = v;
  }

  get brand(): string {
    return this.attributes.brand;
  }
  set brand(v: string) {
    this.attributes.brand = v;
  }

  get model(): string {
    return this.attributes.model;
  }
  set model(v: string) {
    this.attributes.model = v;
  }

  get color(): string {
    return this.attributes.color;
  }
  set color(v: string) {
    this.attributes.color = v;
  }

  get manufactureYear(): number {
    return this.attributes.manufactureYear;
  }
  set manufactureYear(v: number) {
    this.attributes.manufactureYear = v;
  }

  get modelYear(): number {
    return this.attributes.modelYear;
  }
  set modelYear(v: number) {
    this.attributes.modelYear = v;
  }

  get type(): ITruckType {
    return this.attributes.type;
  }
  set type(v: ITruckType) {
    this.attributes.type = v;
  }

  get proprietary(): IProprietary {
    return this.attributes.proprietary;
  }
  set proprietary(v: IProprietary) {
    this.attributes.proprietary = v;
  }

  get toAttributes(): ITruck {
    const attributes: ITruck = { ...this.attributes };
    return attributes;
  }

  save = async () => {
    const payload = {
      truck: {
        plate: this.plate,
        brand: this.brand,
        model: this.model,
        color: this.color,
        manufactureYear: this.manufactureYear,
        modelYear: this.modelYear,
        type: this.type.id,
        prop: this.proprietary.id,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/truck', payload);
      if (response.data.length == 0) {
        toast.success('Caminhão cadastrado com sucesso!');
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
      truck: {
        plate: this.plate,
        brand: this.brand,
        model: this.model,
        color: this.color,
        manufactureYear: this.manufactureYear,
        modelYear: this.modelYear,
        type: this.type.id,
        prop: this.proprietary.id,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put('/truck/' + this.id, payload);
      if (response.data.length == 0) {
        toast.success('Caminhão atualizado com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete('/truck/' + this.id);
      if (response.data.length == 0) {
        toast.success('Caminhão removido com sucesso!');
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
      const response = await axios.get(`/truck/${id}`);
      const truck = new Truck(response.data);

      return truck;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get(`/truck`);
      const trucks: Truck[] = [];
      for (const data of response.data) trucks.push(data);

      return trucks;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
