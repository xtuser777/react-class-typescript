import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { toast } from 'react-toastify';

export interface IPaymentForm {
  id: number;
  description: string;
  link: number;
  deadline: number;
}

export class PaymentForm implements IPaymentForm {
  private attributes: IPaymentForm;

  constructor(attributes?: IPaymentForm) {
    this.attributes = attributes
      ? attributes
      : { id: 0, description: '', link: 0, deadline: 0 };
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

  get link(): number {
    return this.attributes.link;
  }
  set link(v: number) {
    this.attributes.link = v;
  }

  get deadline(): number {
    return this.attributes.deadline;
  }
  set deadline(v: number) {
    this.attributes.deadline = v;
  }

  get toAttributes(): IPaymentForm {
    const attributes: IPaymentForm = { ...this.attributes };
    return attributes;
  }

  save = async () => {
    const payload = {
      form: {
        description: this.description,
        link: this.link,
        deadline: this.deadline,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('payment-form', payload);
      if (response.data.length == 0) {
        toast.success('Forma de pagamento cadastrada com sucesso!');
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
      form: {
        description: this.description,
        link: this.link,
        deadline: this.deadline,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        'payment-form/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Forma de pagamento atualizada com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete('payment-form/' + this.id);
      if (response.data.length == 0) {
        toast.success('Forma de pagamento removida com sucesso!');
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
      const response = await axios.get('/payment-form/' + id);
      let data;
      if (response.data) data = response.data;
      else return undefined;
      const form = new PaymentForm(data);

      return form;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  };

  get = async () => {
    try {
      const response = await axios.get('/payment-form');
      const forms: PaymentForm[] = [];
      for (const data of response.data) forms.push(new PaymentForm(data));

      return forms;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  };
}
