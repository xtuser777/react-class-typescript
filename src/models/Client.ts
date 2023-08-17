import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { IPerson, Person } from './Person';
import { toast } from 'react-toastify';
import { IndividualPerson } from './IndividualPerson';
import { EnterprisePerson } from './EnterprisePerson';

export interface IClient {
  id: number;
  register: string;
  person: IPerson;
}

export class Client {
  private attributes: IClient;

  constructor(attributes?: IClient) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          register: '',
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

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get toAttributes(): IClient {
    const attributes: IClient = { ...this.attributes };
    return attributes;
  }

  async save() {
    const payload = {
      address: {
        street:
          this.person.type == 1
            ? this.person.contact.address.street
            : this.person.contact.address.street,
        number:
          this.person.type == 1
            ? this.person.contact.address.number
            : this.person.contact.address.number,
        neighborhood:
          this.person.type == 1
            ? this.person.contact.address.neighborhood
            : this.person.contact.address.neighborhood,
        complement:
          this.person.type == 1
            ? this.person.contact.address.complement
            : this.person.contact.address.complement,
        code:
          this.person.type == 1
            ? this.person.contact.address.code
            : this.person.contact.address.code,
        city:
          this.person.type == 1
            ? this.person.contact.address.city.id
            : this.person.contact.address.city.id,
      },
      contact: {
        phone:
          this.person.type == 1 ? this.person.contact.phone : this.person.contact.phone,
        cellphone:
          this.person.type == 1
            ? this.person.contact.cellphone
            : this.person.contact.cellphone,
        email:
          this.person.type == 1 ? this.person.contact.email : this.person.contact.email,
      },
      person: {
        name:
          this.person.type == 1 ? (this.person.individual as IndividualPerson).name : '',
        cpf:
          this.person.type == 1 ? (this.person.individual as IndividualPerson).cpf : '',
        birth:
          this.person.type == 1
            ? (this.person.individual as IndividualPerson).birth.substring(0, 10)
            : '',
        corporateName:
          this.person.type == 2
            ? (this.person.enterprise as EnterprisePerson).corporateName
            : '',
        fantasyName:
          this.person.type == 2
            ? (this.person.enterprise as EnterprisePerson).fantasyName
            : '',
        cnpj:
          this.person.type == 2 ? (this.person.enterprise as EnterprisePerson).cnpj : '',
        type: this.person.type,
      },
      client: {
        register: new Date().toISOString().substring(0, 10),
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/client', payload);
      if (response.data.length == 0) {
        toast.success('Cliente cadastrado com sucesso!');
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
        street:
          this.person.type == 1
            ? this.person.contact.address.street
            : this.person.contact.address.street,
        number:
          this.person.type == 1
            ? this.person.contact.address.number
            : this.person.contact.address.number,
        neighborhood:
          this.person.type == 1
            ? this.person.contact.address.neighborhood
            : this.person.contact.address.neighborhood,
        complement:
          this.person.type == 1
            ? this.person.contact.address.complement
            : this.person.contact.address.complement,
        code:
          this.person.type == 1
            ? this.person.contact.address.code
            : this.person.contact.address.code,
        city:
          this.person.type == 1
            ? this.person.contact.address.city.id
            : this.person.contact.address.city.id,
      },
      contact: {
        phone:
          this.person.type == 1 ? this.person.contact.phone : this.person.contact.phone,
        cellphone:
          this.person.type == 1
            ? this.person.contact.cellphone
            : this.person.contact.cellphone,
        email:
          this.person.type == 1 ? this.person.contact.email : this.person.contact.email,
      },
      person: {
        name:
          this.person.type == 1 ? (this.person.individual as IndividualPerson).name : '',
        cpf:
          this.person.type == 1 ? (this.person.individual as IndividualPerson).cpf : '',
        birth:
          this.person.type == 1
            ? (this.person.individual as IndividualPerson).birth.substring(0, 10)
            : '',
        corporateName:
          this.person.type == 2
            ? (this.person.enterprise as EnterprisePerson).corporateName
            : '',
        fantasyName:
          this.person.type == 2
            ? (this.person.enterprise as EnterprisePerson).fantasyName
            : '',
        cnpj:
          this.person.type == 2 ? (this.person.enterprise as EnterprisePerson).cnpj : '',
        type: this.person.type,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(`/client/${this.id}`, payload);
      if (response.data.length == 0) {
        toast.success('Cliente atualizado com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete(`/client/${this.id}`);
      if (response.data.length == 0) {
        toast.success('Cliente excluído com sucesso!');
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
      const response = await axios.get(`/client/${id}`);
      const client = response.data ? new Client(response.data) : undefined;

      return client;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get(`/client`);
      const clients: Client[] = [];
      for (const data of response.data) clients.push(new Client(data));

      return clients;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
