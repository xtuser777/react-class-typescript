import axios from '../../services/axios';
import { SaleBudget } from '../../models/SaleBudget';
import { IState } from '../../models/State';
import { ITruckType } from '../../models/TruckType';
import { formatarPeso, formatarValor, formatarDataIso } from '../../utils/format';
import { Client } from '../../models/Client';
import { Representation } from '../../models/Representation';
import { FreightBudget } from '../../models/FreightBudget';
import { IFreightItem } from '../../models/FreightItem';
import { Validate } from './validations';
import { FreightBudgetComponent } from './component';

export class FreightBudgetFunctions {
  private component: FreightBudgetComponent;

  constructor(component: FreightBudgetComponent) {
    this.component = component;
  }

  getStates = async () => {
    const response = await axios.get('/state');
    this.component.setState({ states: response.data });
    return response.data;
  };

  getSales = async () => {
    const data = await new SaleBudget().get();
    this.component.setState({ sales: data });
  };

  getClients = async () => {
    const response = await new Client().get();
    this.component.setState({ clients: response });
  };

  getRepresentations = async () => {
    const response = await new Representation().get();
    this.component.setState({ representationsDb: response });
  };

  getData = async (id: number, states: IState[]) => {
    const budget = await new FreightBudget().getOne(id);
    if (budget) {
      const newTypes: ITruckType[] = [];
      for (const item of budget.items) {
        for (const t of item.product.types) {
          const exists = newTypes.find((i) => i.id == t.id);
          if (!exists) newTypes.push(t);
        }
      }

      this.component.setState({
        budget,
        description: budget.description,
        salesBudget: budget.saleBudget ? budget.saleBudget.id.toString() : '0',
        representation: budget.representation ? budget.representation.id.toString() : '0',
        client: budget.client.id.toString(),
        destinyState: budget.destiny.state.id.toString(),
        cities: states[budget.destiny.state.id - 1].cities,
        destinyCity: budget.destiny.id.toString(),
        truckType: budget.truckType.id.toString(),
        distance: budget.distance,
        weight: formatarPeso(budget.weight),
        price: formatarValor(budget.value),
        shipping: formatarDataIso(budget.shipping),
        dueDate: formatarDataIso(budget.validate),
        items: budget.items,
        types: newTypes,
      });
    }
  };

  fillFieldsSale = async (saleId: number) => {
    const { budget, states } = this.component.state;
    const sale = (await new SaleBudget().getOne(saleId)) as SaleBudget;
    budget.representation = undefined;
    this.component.setState({
      representation: '0',
      client: sale.client ? sale.client.id.toString() : '0',
      destinyState: sale.destiny.state.id.toString(),
      cities: states[sale.destiny.state.id - 1].cities,
      destinyCity: sale.destiny.id.toString(),
      dueDate: formatarDataIso(sale.validate),
    });

    const newTypes: ITruckType[] = [];
    const newItems: IFreightItem[] = [];
    for (const item of sale.items) {
      newItems.push({
        id: 0,
        product: item.product,
        quantity: item.quantity,
        weight: item.weight,
        budget: budget.toAttributes,
      });
      for (const t of item.product.types) {
        const exists = newTypes.find((i) => i.id == t.id);
        if (!exists) newTypes.push(t);
      }
    }
    this.component.setState({
      items: newItems,
      types: newTypes,
      weight: formatarValor(sale.toAttributes.weight),
    });
    budget.weight = sale.toAttributes.weight;
    budget.saleBudget = sale.toAttributes;
  };

  validateFields = () => {
    const {
      description,
      client,
      destinyState,
      destinyCity,
      truckType,
      distance,
      weight,
      price,
      shipping,
      dueDate,
    } = this.component.state;
    const validate = new Validate(this.component, this);
    return (
      validate.description(description) &&
      validate.client(client) &&
      validate.destinyState(destinyState) &&
      validate.destinyCity(destinyCity) &&
      validate.type(truckType) &&
      validate.distance(distance.toString()) &&
      validate.items() &&
      validate.weight(weight) &&
      validate.price(price) &&
      validate.shipping(shipping) &&
      validate.dueDate(dueDate)
    );
  };

  clearFields = () => {
    this.component.setState({
      description: '',
      salesBudget: '0',
      representation: '0',
      client: '0',
      destinyState: '0',
      truckType: '0',
      distance: 1,
      items: [],
      weight: '',
      price: '',
      shipping: '',
      dueDate: '',
    });
    this.component.itemRef.current?.clearItemFields();
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
  changeItem = (items: IFreightItem[], totalWeight: string, types: ITruckType[]) => {
    this.component.setState({ items, weight: totalWeight, types });
  };

  setErrorType = (value?: string) => {
    this.component.setState({ errorType: value });
  };

  filterItems = () => {
    const { truckType, items } = this.component.state;
    if (truckType != '0') {
      const tmp = [...items];
      return tmp.filter(
        (i) => i.product.types.find((t) => t.id == Number(truckType)) != undefined,
      );
    }

    return items;
  };
}
