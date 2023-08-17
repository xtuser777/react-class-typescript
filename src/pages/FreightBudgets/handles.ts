import { ChangeEvent } from 'react';
import { FreightBudgetsFunctions } from './functions';
import { FreightBudgetsComponent } from './component';

export class FreightBudgetsHandles {
  private component: FreightBudgetsComponent;
  private functions: FreightBudgetsFunctions;

  constructor(component: FreightBudgetsComponent, functions: FreightBudgetsFunctions) {
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
