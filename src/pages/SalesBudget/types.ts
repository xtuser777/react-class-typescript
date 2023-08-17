import { Params } from 'react-router-dom';
import { ICity } from '../../models/City';
import { IClient } from '../../models/Client';
import { IEmployee } from '../../models/Employee';
import { SaleBudget } from '../../models/SaleBudget';
import { ISaleItem } from '../../models/SaleItem';
import { IState } from '../../models/State';

export interface ISalesBudgetProps {
  params: Readonly<Params<string>>;
}

export interface ISalesBudgetState {
  budget: SaleBudget;
  clients: IClient[];
  states: IState[];
  cities: ICity[];
  salesmans: IEmployee[];
  client: string;
  name: string;
  type: string;
  cpf: string;
  cnpj: string;
  phone: string;
  cellphone: string;
  email: string;
  description: string;
  salesman: string;
  destinyState: string;
  destinyCity: string;
  weight: string;
  price: string;
  dueDate: string;
  items: ISaleItem[];
  errorName?: string | undefined;
  errorType?: string | undefined;
  errorCpf?: string | undefined;
  errorCnpj?: string | undefined;
  errorPhone?: string | undefined;
  errorCellphone?: string | undefined;
  errorEmail?: string | undefined;
  errorDescription?: string | undefined;
  errorDestinyState?: string | undefined;
  errorDestinyCity?: string | undefined;
  errorWeight?: string | undefined;
  errorPrice?: string | undefined;
  errorDueDate?: string | undefined;
  addItems: boolean;
}
