import { AxiosRequestConfig, isAxiosError } from 'axios';
import { ILevel, Level } from './Level';
import { IPerson, Person } from './Person';
import { toast } from 'react-toastify';
import axios from '../services/axios';
import { IndividualPerson } from './IndividualPerson';

export interface IEmployee {
  id: number;
  type: number;
  login: string;
  password: string | undefined;
  admission: string;
  demission: string | undefined;
  person: IPerson;
  level: ILevel;
}

export class Employee {
  private attributes: IEmployee;

  constructor(attributes?: IEmployee) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          type: 0,
          login: '',
          password: undefined,
          admission: '',
          demission: undefined,
          person: new Person(),
          level: new Level(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get type(): number {
    return this.attributes.type;
  }
  set type(v: number) {
    this.attributes.type = v;
  }

  get login(): string {
    return this.attributes.login;
  }
  set login(v: string) {
    this.attributes.login = v;
  }

  get password(): string | undefined {
    return this.attributes.password;
  }
  set password(v: string | undefined) {
    this.attributes.password = v;
  }

  get admission(): string {
    return this.attributes.admission;
  }
  set admission(v: string) {
    this.attributes.admission = v;
  }

  get demission(): string | undefined {
    return this.attributes.demission;
  }
  set demission(v: string | undefined) {
    this.attributes.demission = v;
  }

  get person(): IPerson {
    return this.attributes.person;
  }
  set person(v: IPerson) {
    this.attributes.person = v;
  }

  get level(): ILevel {
    return this.attributes.level;
  }
  set level(v: ILevel) {
    this.attributes.level = v;
  }

  get toAttributes(): IEmployee {
    const attributes: IEmployee = { ...this.attributes };
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
        name: (this.person.individual as IndividualPerson).name,
        cpf: (this.person.individual as IndividualPerson).cpf,
        birth: (this.person.individual as IndividualPerson).birth.substring(0, 10),
      },
      employee: {
        type: this.type,
        login: this.login,
        password: this.password as string,
        admission: this.admission.substring(0, 10),
        level: this.type == 1 ? this.level.id : 3,
      },
    };

    console.log(payload);

    try {
      const response: AxiosRequestConfig = await axios.post('/employee', payload);
      if (response.data.length == 0) {
        toast.success('Funcionário cadastrado com sucesso!');
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
        name: (this.person.individual as IndividualPerson).name,
        cpf: (this.person.individual as IndividualPerson).cpf,
        birth: (this.person.individual as IndividualPerson).birth.substring(0, 10),
      },
      employee: {
        id: this.id,
        type: this.type,
        login: this.login,
        password: this.password,
        admission: this.admission.substring(0, 10),
        level: this.level.id,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        `/employee/${payload.employee.id}`,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Funcionário atualizado com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete(`/employee/${this.id}`);
      if (response.data.length == 0) {
        toast.success('Funcionário excluído com sucesso!');
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
      const response = await axios.get(`/employee/${id}`);
      const user = response.data ? new Employee(response.data) : undefined;

      return user;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get(`/employee`);
      const users: Employee[] = [];
      for (const data of response.data) users.push(new Employee(data));

      return users;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  }
}
