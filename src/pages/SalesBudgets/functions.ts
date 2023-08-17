import { IndividualPerson } from '../../models/IndividualPerson';
import { ISaleBudget, SaleBudget } from '../../models/SaleBudget';
import { SalesBudgetsComponent } from './component';

export class SalesBudgetsFunctions {
  private component: SalesBudgetsComponent;

  constructor(component: SalesBudgetsComponent) {
    this.component = component;
  }

  getData = async () => {
    const data = await new SaleBudget().get();
    this.component.setState({ data, budgets: data });
  };

  filterData = (orderBy: string) => {
    const { data, filter, date } = this.component.state;
    let filteredData: ISaleBudget[] = [...data];
    if (date.length == 10) {
      filteredData = filteredData.filter((item) => item.date.substring(0, 10) == date);
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter(
        (item) => item.clientName.includes(filter) || item.description.includes(filter),
      );
    }

    switch (orderBy) {
      case '1':
        filteredData = filteredData.sort((x, y) => x.id - y.id);
        break;
      case '2':
        filteredData = filteredData.sort((x, y) => y.id - x.id);
        break;
      case '3':
        filteredData = filteredData.sort((x, y) => {
          if (x.description.toUpperCase() > y.description.toUpperCase()) return 1;
          if (x.description.toUpperCase() < y.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (y.description.toUpperCase() > x.description.toUpperCase()) return 1;
          if (y.description.toUpperCase() < x.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.clientName.toUpperCase() > y.clientName.toUpperCase()) return 1;
          if (x.clientName.toUpperCase() < y.clientName.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.clientName.toUpperCase() > x.clientName.toUpperCase()) return 1;
          if (y.clientName.toUpperCase() < x.clientName.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (x.date.toUpperCase() > y.date.toUpperCase()) return 1;
          if (x.date.toUpperCase() < y.date.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (y.date.toUpperCase() > x.date.toUpperCase()) return 1;
          if (y.date.toUpperCase() < x.date.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (
            (x.author.person.individual as IndividualPerson).name.toUpperCase() >
            (y.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (y.author.person.individual as IndividualPerson).name.toUpperCase() <
            (x.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (
            (y.author.person.individual as IndividualPerson).name.toUpperCase() >
            (x.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (y.author.person.individual as IndividualPerson).name.toUpperCase() <
            (x.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '11':
        filteredData = filteredData.sort((x, y) => x.value - y.value);
        break;
      case '12':
        filteredData = filteredData.sort((x, y) => y.value - x.value);
        break;
    }

    return filteredData;
  };

  remove = async (id: number) => {
    const { data, budgets } = this.component.state;
    const response = confirm('Confirma a exclusão deste orçamento?');
    if (response) {
      const budget = budgets.find((item) => item.id == id) as SaleBudget;
      if (await budget.delete()) {
        const newData = [...data];
        newData.splice(
          newData.findIndex((item) => item.id == id),
          1,
        );
        const newBudgets = [...budgets];
        newBudgets.splice(
          newBudgets.findIndex((item) => item.id == id),
          1,
        );
        this.component.setState({ data: newData, budgets: newBudgets });
      }
    }
  };
}
