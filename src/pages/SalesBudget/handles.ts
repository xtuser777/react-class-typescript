import { ChangeEvent } from 'react';
import { ISaleItem } from '../../models/SaleItem';
import { formatarPeso, formatarValor } from '../../utils/format';
import { SalesBudget } from '.';
import { SalesBudgetFunctions } from './functions';
import { Client } from '../../models/Client';
import { Employee } from '../../models/Employee';

export class SalesBudgetHandles {
  private component: SalesBudget;
  private functions: SalesBudgetFunctions;

  constructor(component: SalesBudget, functions: SalesBudgetFunctions) {
    this.component = component;
    this.functions = functions;
  }

  handleClientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { budget, clients } = this.component.state;
    this.component.setState({ client: e.target.value });
    if (e.target.value != '0') {
      budget.client = (
        clients.find((item) => item.id == Number(e.target.value)) as Client
      ).toAttributes;
      this.functions.fillClient(budget.client as Client);
    } else {
      budget.client = undefined;
      this.component.setState({ name: '' });
      this.component.setState({ type: '1' });
      this.component.setState({ cpf: '' });
      this.component.setState({ cnpj: '' });
      this.component.setState({ phone: '' });
      this.component.setState({ cellphone: '' });
      this.component.setState({ email: '' });
    }
  };
  handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ name: e.target.value });
    this.component.validate.name(e.target.value);
  };
  handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ type: e.target.value });
    this.component.validate.type(e.target.value);
  };
  handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ cpf: e.target.value });
    this.component.validate.cpf(e.target.value);
  };
  handleCnpjChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ cnpj: e.target.value });
    this.component.validate.cnpj(e.target.value);
  };
  handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ phone: e.target.value });
    this.component.validate.phone(e.target.value);
  };
  handleCellphoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ cellphone: e.target.value });
    this.component.validate.cellphone(e.target.value);
  };
  handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ email: e.target.value });
    this.component.validate.email(e.target.value);
  };

  //handleChange = (e: ChangeEvent<HTMLInputElement>) => {};

  handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ description: e.target.value });
    this.component.validate.description(e.target.value);
  };
  handleSalesmanChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { budget, salesmans } = this.component.state;
    this.component.setState({ salesman: e.target.value });
    if (e.target.value != '0')
      budget.salesman = (
        salesmans.find((item) => item.id == Number(e.target.value)) as Employee
      ).toAttributes;
  };
  handleDestinyStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ destinyState: e.target.value });
    this.component.validate.destinyState(e.target.value);
  };
  handleDestinyCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ destinyCity: e.target.value });
    this.component.validate.destinyCity(e.target.value);
  };

  handleClearItemsClick = () => {
    this.component.setState({ items: [], weight: '', price: '' });
  };

  handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ weight: e.target.value });
    this.component.validate.weight(e.target.value);
  };
  handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ price: e.target.value });
    this.component.validate.price(e.target.value);
  };
  handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ dueDate: e.target.value });
    this.component.validate.dueDate(e.target.value);
  };

  handleDelItemClick = (item: ISaleItem) => {
    const newItems: ISaleItem[] = [];
    this.component.state.items.forEach((i) => {
      if (i.product.id != item.product.id) newItems.push(i);
    });
    let totalWeight = 0.0;
    newItems.forEach((item) => (totalWeight += item.weight));
    totalWeight = Number.parseFloat(totalWeight.toString());

    let totalPrice = 0.0;
    newItems.forEach((item) => (totalPrice += item.price));
    totalPrice = Number.parseFloat(totalPrice.toString());

    this.component.setState({
      items: newItems,
      weight: formatarPeso(totalWeight),
      price: formatarValor(totalPrice),
    });
  };
}
