export interface IIndividualPerson {
  id: number;
  name: string;
  cpf: string;
  birth: string;
}

export class IndividualPerson implements IIndividualPerson {
  private attributes: IIndividualPerson;

  constructor(attributes?: IIndividualPerson) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          name: '',
          cpf: '',
          birth: '',
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get name(): string {
    return this.attributes.name;
  }
  set name(v: string) {
    this.attributes.name = v;
  }

  get cpf(): string {
    return this.attributes.cpf;
  }
  set cpf(v: string) {
    this.attributes.cpf = v;
  }

  get birth(): string {
    return this.attributes.birth;
  }
  set birth(v: string) {
    this.attributes.birth = v;
  }

  get toAttributes(): IIndividualPerson {
    const attributes: IIndividualPerson = { ...this.attributes };
    return attributes;
  }
}
