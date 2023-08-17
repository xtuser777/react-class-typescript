export interface IEnterprisePerson {
  id: number;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
}

export class EnterprisePerson implements IEnterprisePerson {
  private attributes: IEnterprisePerson;
  constructor(attributes?: IEnterprisePerson) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          corporateName: '',
          fantasyName: '',
          cnpj: '',
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get corporateName(): string {
    return this.attributes.corporateName;
  }
  set corporateName(v: string) {
    this.attributes.corporateName = v;
  }

  get fantasyName(): string {
    return this.attributes.fantasyName;
  }
  set fantasyName(v: string) {
    this.attributes.fantasyName = v;
  }

  get cnpj(): string {
    return this.attributes.cnpj;
  }
  set cnpj(v: string) {
    this.attributes.cnpj = v;
  }

  get toAttributes(): IEnterprisePerson {
    const attributes: IEnterprisePerson = { ...this.attributes };
    return attributes;
  }
}
