import { IState, State } from './State';

export interface ICity {
  id: number;
  name: string;
  state: IState;
}

export class City implements ICity {
  private attributes: ICity;

  constructor(attributes?: ICity) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          name: '',
          state: new State(),
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

  get state(): IState {
    return this.attributes.state;
  }
  set state(v: IState) {
    this.attributes.state = v;
  }

  get toAttributes(): ICity {
    const attributes: ICity = { ...this.attributes };
    return attributes;
  }
}
