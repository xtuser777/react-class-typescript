import { IProduct } from '../../models/Product';
import { IRepresentation } from '../../models/Representation';
import { ISaleItem } from '../../models/SaleItem';

export interface IFormSaleItemProps {
  changeItem: (items: ISaleItem[], totalWeight: string, totalPrice: string) => void;
  items: ISaleItem[];
  destinyState: string;
}

export interface IFormSaleItemState {
  representations: IRepresentation[];
  representationsDb: IRepresentation[];
  products: IProduct[];
  productsDb: IProduct[];
  itemRepresentation: string;
  itemRepresentationFilter: string;
  item: string;
  itemFilter: string;
  itemPrice: string;
  itemQuantity: number;
  totalItemPrice: string;
  errorItemRepresentation?: string | undefined;
  errorItem?: string | undefined;
  errorItemPrice?: string | undefined;
  errorItemQuantity?: string | undefined;
  errorTotalItemPrice?: string | undefined;
}
