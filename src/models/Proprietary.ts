import { toast } from 'react-toastify';
import axios from '../services/axios';
import { IDriver } from './Driver';
import { IPerson, Person } from './Person';
import { AxiosRequestConfig, isAxiosError } from 'axios';
import { IndividualPerson } from './IndividualPerson';
import { EnterprisePerson } from './EnterprisePerson';

export interface IProprietary {
  id: number;
  register: string;
  driver: IDriver | undefined;
  person: IPerson;
}

export class Proprietary {
  private attributes: IProprietary;

  constructor(attributes?: IProprietary) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          register: '',
          driver: undefined,
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

  get driver(): IDriver | undefined {
    return this.attributes.driver;
  }
  set driver(v: IDriver | undefined) {
    this.attributes.driver = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get toAttributes(): IProprietary {
    const attributes: IProprietary = { ...this.attributes };
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
      prop: {
        register: new Date().toISOString().substring(0, 10),
        driver: this.driver?.id,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/proprietary', payload);
      if (response.data.length == 0) {
        toast.success('Proprietário cadastrado com sucesso!');
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
      prop: {
        driver: this.driver?.id,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        '/proprietary/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Proprietário atualizado com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete('/proprietary/' + this.id);
      if (response.data.length == 0) {
        toast.success('Proprietário removido com sucesso!');
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
      const response = await axios.get(`/proprietary/${id}`);
      const prop = response.data ? new Proprietary(response.data) : undefined;

      return prop;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get(`/proprietary`);
      const props: Proprietary[] = [];
      for (const data of response.data) props.push(new Proprietary(data));

      return props;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
