import { IFreightBudget } from '../../models/FreightBudget';

export interface IFreightBudgetsState {
  data: IFreightBudget[];
  budgets: IFreightBudget[];
  filter: string;
  date: string;
  orderBy: string;
}
