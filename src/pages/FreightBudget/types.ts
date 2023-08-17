import { Params } from 'react-router-dom';
import { ICity } from '../../models/City';
import { IClient } from '../../models/Client';
import { IFreightItem } from '../../models/FreightItem';
import { IRepresentation } from '../../models/Representation';
import { ISaleBudget } from '../../models/SaleBudget';
import { IState } from '../../models/State';
import { ITruckType } from '../../models/TruckType';
import { FreightBudget } from '../../models/FreightBudget';

export interface IFreightBudgetProps {
  params: Readonly<Params<string>>;
}

export interface IFreightBudgetState {
  budget: FreightBudget;
  sales: Array<ISaleBudget>;
  representationsDb: Array<IRepresentation>;
  clients: Array<IClient>;
  states: Array<IState>;
  cities: Array<ICity>;
  types: Array<ITruckType>;
  description: string;
  salesBudget: string;
  representation: string;
  client: string;
  destinyState: string;
  destinyCity: string;
  truckType: string;
  distance: number;
  weight: string;
  price: string;
  shipping: string;
  dueDate: string;
  minimumFloor: number;
  addItems: boolean;
  items: Array<IFreightItem>; //
  errorDescription?: string | undefined;
  errorClient?: string | undefined;
  errorDestinyState?: string | undefined;
  errorDestinyCity?: string | undefined;
  errorType?: string | undefined;
  errorDistance?: string | undefined;
  errorWeight?: string | undefined;
  errorPrice?: string | undefined;
  errorShipping?: string | undefined;
  errorDueDate?: string | undefined;
}
