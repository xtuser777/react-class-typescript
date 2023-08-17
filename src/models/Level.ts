export interface ILevel {
  id: number;
  description: string;
}

export class Level implements ILevel {
  private attributes: ILevel;

  constructor(attributes?: ILevel) {
    this.attributes = attributes ? attributes : { id: 0, description: '' };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get toAttributes(): ILevel {
    const attributes: ILevel = { ...this.attributes };
    return attributes;
  }
}
