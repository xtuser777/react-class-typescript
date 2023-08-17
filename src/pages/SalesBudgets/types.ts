import { ISaleBudget } from '../../models/SaleBudget';

export interface ISalesBudgetsState {
  data: ISaleBudget[];
  budgets: ISaleBudget[];
  filter: string;
  date: string;
  orderBy: string;
}
