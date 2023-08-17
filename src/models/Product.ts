import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { IRepresentation, Representation } from './Representation';
import { ITruckType } from './TruckType';
import { toast } from 'react-toastify';

export interface IProduct {
  id: number;
  description: string;
  measure: string;
  weight: number;
  price: number;
  priceOut: number;
  representation: IRepresentation;
  types: ITruckType[];
}

export class Product implements IProduct {
  private attributes: IProduct;

  constructor(attributes?: IProduct) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          description: '',
          measure: '',
          weight: 0.0,
          price: 0.0,
          priceOut: 0.0,
          representation: new Representation(),
          types: new Array<ITruckType>(),
        };
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

  get measure(): string {
    return this.attributes.measure;
  }
  set measure(v: string) {
    this.attributes.measure = v;
  }

  get weight(): number {
    return this.attributes.weight;
  }
  set weight(v: number) {
    this.attributes.weight = v;
  }

  get price(): number {
    return this.attributes.price;
  }
  set price(v: number) {
    this.attributes.price = v;
  }

  get priceOut(): number {
    return this.attributes.priceOut;
  }
  set priceOut(v: number) {
    this.attributes.priceOut = v;
  }

  get representation(): IRepresentation {
    return this.attributes.representation;
  }
  set representation(v: IRepresentation) {
    this.attributes.representation = v;
  }

  get types(): ITruckType[] {
    return this.attributes.types;
  }
  set types(v: ITruckType[]) {
    this.attributes.types = v;
  }

  get toAttributes(): IProduct {
    const attributes: IProduct = { ...this.attributes };
    return attributes;
  }

  save = async () => {
    const payload = {
      product: {
        description: this.description,
        measure: this.measure,
        weight: this.weight,
        price: this.price,
        priceOut: this.priceOut,
        representation: this.representation.id,
        types: this.types,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/product', payload);
      if (response.data.length == 0) {
        toast.success('Produto cadastrado com sucesso!');
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
      product: {
        id: this.id,
        description: this.description,
        measure: this.measure,
        weight: this.weight,
        price: this.price,
        priceOut: this.priceOut,
        representation: this.representation.id,
        types: this.types,
      },
    };
    try {
      const response: AxiosRequestConfig = await axios.put(
        '/product/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success('Produto atualizado com sucesso!');
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
      const response: AxiosRequestConfig = await axios.delete('/product/' + this.id);
      if (response.data.length == 0) {
        toast.success('Produto removido com sucesso!');
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

  getOne = async (id: number) => {
    if (id <= 0) return undefined;
    try {
      const response = await axios.get('/product/' + id);
      const product = response.data ? new Product(response.data) : undefined;

      return product;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return undefined;
    }
  };

  get = async () => {
    try {
      const response = await axios.get('/product');
      const products: Product[] = [];
      for (const data of response.data) products.push(new Product(data));

      return products;
    } catch (err) {
      if (isAxiosError(err)) toast.error('Erro de requisição: ' + err.response?.data);
      return [];
    }
  };
}
