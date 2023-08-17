import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { IPerson, Person } from './Person';
import { toast } from 'react-toastify';
import { EnterprisePerson } from './EnterprisePerson';

export interface IParameterization {
  id: number;
  logotype: string;
  person: IPerson;
}

export class Parameterization {
  private attributes: IParameterization;

  constructor(attributes?: IParameterization) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          logotype: '',
          person: new Person(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get logotype(): string {
    return this.attributes.logotype;
  }
  set logotype(v: string) {
    this.attributes.logotype = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get toAttributes(): IParameterization {
    const attributes: IParameterization = { ...this.attributes };
    return attributes;
  }

  async save() {
    const payload = {
      address: {
        street: this.person.contact.address.street,
        number: this.person.contact.address.number,
        neighborhood: this.person.contact.address.neighborhood,
        complement: this.person.contact.address.complement,
        code: this.person.contact.address.code,
        city: this.person.contact.address.city.id,
      },
      contact: {
        phone: this.person.contact.phone,
        cellphone: this.person.contact.cellphone,
        email: this.person.contact.email,
      },
      person: {
        corporateName: (this.person.enterprise as EnterprisePerson).corporateName,
        fantasyName: (this.person.enterprise as EnterprisePerson).fantasyName,
        cnpj: (this.person.enterprise as EnterprisePerson).cnpj,
      },
      parameterization: {
        id: this.id,
        logotype: this.logotype,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/parameterization', payload);
      if (response.data.length == 0) {
        toast.success('Parametrização cadastrada com sucesso!');
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

  async update() {
    const payload = {
      address: {
        street: this.person.contact.address.street,
        number: this.person.contact.address.number,
        neighborhood: this.person.contact.address.neighborhood,
        complement: this.person.contact.address.complement,
        code: this.person.contact.address.code,
        city: this.person.contact.address.city.id,
      },
      contact: {
        phone: this.person.contact.phone,
        cellphone: this.person.contact.cellphone,
        email: this.person.contact.email,
      },
      person: {
        corporateName: (this.person.enterprise as EnterprisePerson).corporateName,
        fantasyName: (this.person.enterprise as EnterprisePerson).fantasyName,
        cnpj: (this.person.enterprise as EnterprisePerson).cnpj,
      },
      parameterization: {
        id: this.id,
        logotype: this.logotype,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(`/parameterization/`, payload);
      if (response.data.length == 0) {
        toast.success('Parametrização atualizada com sucesso!');
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

  async get() {
    try {
      const response = await axios.get(`/parameterization`);
      const parameterization = response.data
        ? new Parameterization(response.data)
        : undefined;

      return parameterization;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }
}
