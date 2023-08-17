export interface IBankData {
  id: number;
  bank: string;
  agency: string;
  account: string;
  type: number;
}

export class BankData implements IBankData {
  private attributes: IBankData;

  constructor(attributes?: IBankData) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          bank: '',
          agency: '',
          account: '',
          type: 0,
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get bank(): string {
    return this.attributes.bank;
  }
  set bank(v: string) {
    this.attributes.bank = v;
  }

  get agency(): string {
    return this.attributes.agency;
  }
  set agency(v: string) {
    this.attributes.agency = v;
  }

  get account(): string {
    return this.attributes.account;
  }
  set account(v: string) {
    this.attributes.account = v;
  }

  get type(): number {
    return this.attributes.type;
  }
  set type(v: number) {
    this.attributes.type = v;
  }

  get toAttributes(): IBankData {
    const attributes: IBankData = { ...this.attributes };
    return attributes;
  }
}
