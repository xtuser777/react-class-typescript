import { Contact, IContact } from './Contact';
import { IEnterprisePerson } from './EnterprisePerson';
import { IIndividualPerson } from './IndividualPerson';

export interface IPerson {
  id: number;
  type: number;
  individual?: IIndividualPerson;
  enterprise?: IEnterprisePerson;
  contact: IContact;
}

export class Person implements IPerson {
  private attributes: IPerson;

  constructor(attributes?: IPerson) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          type: 0,
          individual: undefined,
          enterprise: undefined,
          contact: new Contact(),
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

  get individual(): IIndividualPerson | undefined {
    return this.attributes.individual;
  }
  set individual(v: IIndividualPerson | undefined) {
    this.attributes.individual = v;
  }

  get enterprise(): IEnterprisePerson | undefined {
    return this.attributes.enterprise;
  }
  set enterprise(v: IEnterprisePerson | undefined) {
    this.attributes.enterprise = v;
  }

  get contact(): IContact {
    return this.attributes.contact;
  }
  set contact(v: IContact) {
    this.attributes.contact = v;
  }

  get toAttributes(): IPerson {
    const attributes: IPerson = { ...this.attributes };
    return attributes;
  }
}
