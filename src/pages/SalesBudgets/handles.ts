import { ChangeEvent } from 'react';
import { SalesBudgetsFunctions } from './functions';
import { SalesBudgetsComponent } from './component';

export class SalesBudgetsHandles {
  private component: SalesBudgetsComponent;
  private functions: SalesBudgetsFunctions;

  constructor(component: SalesBudgetsComponent, functions: SalesBudgetsFunctions) {
    this.component = component;
    this.functions = functions;
  }

  handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ filter: e.target.value });
  };

  handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ date: e.target.value });
  };

  handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({
      orderBy: e.target.value,
      budgets: this.functions.filterData(e.target.value),
    });
  };

  handleFilterClick = () => {
    this.component.setState({
      budgets: this.functions.filterData(this.component.state.orderBy),
    });
  };
}
