import { ICity } from './City';

export interface IState {
  id: number;
  name: string;
  acronym: string;
  cities: ICity[];
}

export class State implements IState {
  private attributes: IState;

  constructor(attributes?: IState) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          name: '',
          acronym: '',
          cities: [],
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

  get acronym(): string {
    return this.attributes.acronym;
  }
  set acronym(v: string) {
    this.attributes.acronym = v;
  }

  get cities(): ICity[] {
    return this.attributes.cities;
  }
  set cities(v: ICity[]) {
    this.attributes.cities = v;
  }

  get toAttributes(): IState {
    const attributes: IState = { ...this.attributes };
    return attributes;
  }
}
