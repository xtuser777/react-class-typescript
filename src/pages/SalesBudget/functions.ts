import { Client } from '../../models/Client';
import { Employee } from '../../models/Employee';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { IndividualPerson } from '../../models/IndividualPerson';
import { SaleBudget } from '../../models/SaleBudget';
import { ISaleItem } from '../../models/SaleItem';
import { IState } from '../../models/State';
import axios from '../../services/axios';
import { formatarPeso, formatarValor, formatarDataIso } from '../../utils/format';
import { SalesBudget } from '.';

export class SalesBudgetFunctions {
  private component: SalesBudget;

  constructor(component: SalesBudget) {
    this.component = component;
  }

  getStates = async () => {
    const response = await axios.get('/state');
    this.component.setState({ states: response.data });
    return response.data;
  };

  getSalesmans = async () => {
    const response = await new Employee().get();
    const salesman = response.filter((item) => item.type == 2);
    this.component.setState({ salesmans: salesman });
  };

  getClients = async () => {
    const response = await new Client().get();
    this.component.setState({ clients: response });
  };

  getData = async (id: number, states: IState[]) => {
    const budget = await new SaleBudget().getOne(id);
    if (budget) {
      this.component.setState({ budget });

      if (budget.client) {
        this.component.setState({ client: budget.client.id.toString() });
      }

      this.component.setState({
        name: budget.clientName,
        type: budget.clientDocument.length == 14 ? '1' : '2',
        phone: budget.clientPhone,
        cellphone: budget.clientCellphone,
        email: budget.clientEmail,
        description: budget.description,
        salesman: budget.salesman ? budget.salesman.id.toString() : '0',
        destinyState: budget.destiny.state.id.toString(),
        cities: states[budget.destiny.state.id - 1].cities,
        destinyCity: budget.destiny.id.toString(),
        weight: formatarPeso(budget.weight),
        price: formatarValor(budget.value),
        dueDate: formatarDataIso(budget.validate),
        items: budget.items,
      });

      if (budget.clientDocument.length == 14)
        this.component.setState({ cpf: budget.clientDocument });
      else this.component.setState({ cnpj: budget.clientDocument });
    }
  };

  fillClient = (client: Client) => {
    if (client.person.type == 1) {
      this.component.setState({
        name: (client.person.individual as IndividualPerson).name,
      });
      this.component.setState({ type: '1' });
      this.component.setState({
        cpf: (client.person.individual as IndividualPerson).cpf,
      });
    } else {
      this.component.setState({
        name: (client.person.enterprise as EnterprisePerson).fantasyName,
      });
      this.component.setState({ type: '2' });
      this.component.setState({
        cnpj: (client.person.enterprise as EnterprisePerson).cnpj,
      });
    }
    this.component.setState({ phone: client.person.contact.phone });
    this.component.setState({ cellphone: client.person.contact.cellphone });
    this.component.setState({ email: client.person.contact.email });
  };

  validateFields = () => {
    const {
      name,
      type,
      cpf,
      cnpj,
      phone,
      cellphone,
      email,
      description,
      destinyState,
      destinyCity,
      weight,
      price,
      dueDate,
    } = this.component.state;
    return (
      this.component.validate.name(name) &&
      this.component.validate.type(type) &&
      (type == '1'
        ? this.component.validate.cpf(cpf)
        : this.component.validate.cnpj(cnpj)) &&
      this.component.validate.phone(phone) &&
      this.component.validate.cellphone(cellphone) &&
      this.component.validate.email(email) &&
      this.component.validate.description(description) &&
      this.component.validate.destinyState(destinyState) &&
      this.component.validate.destinyCity(destinyCity) &&
      this.component.validate.items() &&
      this.component.validate.weight(weight) &&
      this.component.validate.price(price) &&
      this.component.validate.dueDate(dueDate)
    );
  };

  clearFields = () => {
    this.component.setState({
      client: '0',
      name: '',
      type: '1',
      cpf: '',
      cnpj: '',
      phone: '',
      cellphone: '',
      email: '',
      salesman: '0',
      description: '',
      destinyState: '0',
      destinyCity: '0',
      items: [],
      weight: '',
      price: '',
      dueDate: '',
    });
    this.component.itemsRef.current?.functions.clearItemFields();
  };

  persistData = async () => {
    const { budget } = this.component.state;
    if (this.validateFields()) {
      if (this.component.method == 'novo') {
        if (await budget.save()) this.clearFields();
      } else await budget.update();
    }
  };

  // Items
  changeItem = (items: ISaleItem[], totalWeight: string, totalPrice: string) => {
    this.component.setState({ items, weight: totalWeight, price: totalPrice });
  };
}
