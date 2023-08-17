import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { toast } from 'react-toastify';

export interface IBillPayCategory {
  id: number;
  description: string;
}

export class BillPayCategory implements IBillPayCategory {
  private attributes: IBillPayCategory;

  constructor(attributes?: IBillPayCategory) {
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

  get toAttributes(): IBillPayCategory {
    const attributes: IBillPayCategory = { ...this.attributes };
    return attributes;
  }

  save = async () => {
    const payload = {
      category: { description: this.description },
    };

    try {
      console.log(payload);

      const response: AxiosRequestConfig = await axios.post(
        '/bill-pay-category',
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Categoria cadastrada com sucesso!');
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
      category: { description: this.description },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        '/bill-pay-category/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Categoria atualizada com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete(
        '/bill-pay-category/' + this.id,
      );
      if (response.data.length == 0) {
        toast.success('Categoria removida com sucesso!');
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

  getOne = async (id: number) => {
    if (id <= 0) return undefined;
    try {
      const response = await axios.get('/bill-pay-category/' + id);
      let data;
      if (response.data) data = response.data;
      else return undefined;
      const category = new BillPayCategory(data);

      return category;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  };

  get = async () => {
    try {
      const response = await axios.get('/bill-pay-category');
      const categories: BillPayCategory[] = [];
      for (const data of response.data) categories.push(new BillPayCategory(data));

      return categories;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  };
}
