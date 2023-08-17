import { toast } from 'react-toastify';
import axios from '../services/axios';
import { BankData, IBankData } from './BankData';
import { AxiosRequestConfig, isAxiosError } from 'axios';
import { IPerson, Person } from './Person';
import { IndividualPerson } from './IndividualPerson';

export interface IDriver {
  id: number;
  register: string;
  cnh: string;
  person: IPerson;
  bankData: IBankData;
}

export class Driver {
  private attributes: IDriver;

  constructor(attributes?: IDriver) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          register: '',
          cnh: '',
          person: new Person(),
          bankData: new BankData(),
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

  get cnh(): string {
    return this.attributes.cnh;
  }
  set cnh(v: string) {
    this.attributes.cnh = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get bankData(): IBankData {
    return this.attributes.bankData;
  }
  set bankData(v: IBankData) {
    this.attributes.bankData = v;
  }

  get toAttributes(): IDriver {
    const attributes: IDriver = { ...this.attributes };
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
        name: (this.person.individual as IndividualPerson).name,
        cpf: (this.person.individual as IndividualPerson).cpf,
        birth: (this.person.individual as IndividualPerson).birth.substring(0, 10),
      },
      bank: {
        bank: this.bankData.bank,
        agency: this.bankData.agency,
        account: this.bankData.account,
        type: this.bankData.type,
      },
      driver: {
        register: new Date().toISOString().substring(0, 10),
        cnh: this.cnh,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/driver', payload);
      if (response.data.length == 0) {
        toast.success('Motorista cadastrado com sucesso!');
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
        name: (this.person.individual as IndividualPerson).name,
        cpf: (this.person.individual as IndividualPerson).cpf,
        birth: (this.person.individual as IndividualPerson).birth.substring(0, 10),
      },
      bank: {
        bank: this.bankData.bank,
        agency: this.bankData.agency,
        account: this.bankData.account,
        type: this.bankData.type,
      },
      driver: {
        cnh: this.cnh,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put('/driver/' + this.id, payload);
      if (response.data.length == 0) {
        toast.success('Motorista atualizado com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete('/driver/' + this.id);
      if (response.data.length == 0) {
        toast.success('Motorista removido com sucesso!');
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
      const response = await axios.get(`/driver/${id}`);
      const driver = response.data ? new Driver(response.data) : undefined;

      return driver;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get(`/driver`);
      const drivers: Driver[] = [];
      for (const data of response.data) drivers.push(new Driver(data));

      return drivers;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
