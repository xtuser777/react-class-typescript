import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { IPerson, Person } from './Person';
import { toast } from 'react-toastify';
import { IEnterprisePerson } from './EnterprisePerson';

export interface IRepresentation {
  id: number;
  register: string;
  unity: string;
  person: IPerson;
}

export class Representation {
  private attributes: IRepresentation;

  constructor(attributes?: IRepresentation) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          register: '',
          unity: '',
          person: new Person(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get register(): string {
    return this.attributes.register;
  }
  set register(v: string) {
    this.attributes.register = v;
  }

  get unity(): string {
    return this.attributes.unity;
  }
  set unity(v: string) {
    this.attributes.unity = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get toAttributes(): IRepresentation {
    const attributes: IRepresentation = { ...this.attributes };
    return attributes;
  }

  save = async () => {
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
        corporateName: (this.person.enterprise as IEnterprisePerson).corporateName,
        fantasyName: (this.person.enterprise as IEnterprisePerson).fantasyName,
        cnpj: (this.person.enterprise as IEnterprisePerson).cnpj,
        type: 2,
      },
      representation: {
        register: new Date().toISOString().substring(0, 10),
        unity:
          this.unity.length == 0 ? this.person.contact.address.city.name : this.unity,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/representation', payload);
      if (response.data.length == 0) {
        toast.success('Representação cadastrada com sucesso!');
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
        corporateName: (this.person.enterprise as IEnterprisePerson).corporateName,
        fantasyName: (this.person.enterprise as IEnterprisePerson).fantasyName,
        cnpj: (this.person.enterprise as IEnterprisePerson).cnpj,
        type: 2,
      },
      representation: {
        unity: this.unity,
      },
    };
    try {
      const response: AxiosRequestConfig = await axios.put(
        `/representation/${this.id}`,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Representação atualizada com sucesso!');
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

  async delete() {
    try {
      const response: AxiosRequestConfig = await axios.delete(
        `/representation/${this.id}`,
      );
      if (response.data.length == 0) {
        toast.success('Representação excluída com sucesso!');
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

  async getOne(id: number) {
    try {
      const response = await axios.get(`/representation/${id}`);
      const representation = response.data
        ? new Representation(response.data)
        : undefined;

      return representation;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get(`/representation`);
      const reps: Representation[] = [];
      for (const data of response.data) reps.push(new Representation(data));

      return reps;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
