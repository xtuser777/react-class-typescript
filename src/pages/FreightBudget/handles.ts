import { ChangeEvent } from 'react';
import { FormFreightItem } from '../../components/form-freight-item';
import { IProduct } from '../../models/Product';
import { formatarPeso, formatarValor } from '../../utils/format';
import { Representation } from '../../models/Representation';
import { IFreightItem } from '../../models/FreightItem';
import { ITruckType } from '../../models/TruckType';
import { Validate } from './validations';
import { FreightBudgetFunctions } from './functions';
import { FreightBudgetComponent } from './component';

export class FreightBudgetHandles {
  private functions: FreightBudgetFunctions;

  constructor(functions: FreightBudgetFunctions) {
    this.functions = functions;
  }

  handleDescriptionChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ description: e.target.value });
    new Validate(component, this.functions).description(e.target.value);
  };
  handleSalesBudgetChange = async (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ salesBudget: e.target.value });
    if (e.target.value != '0') {
      await this.functions.fillFieldsSale(Number(e.target.value));
    } else {
      component.setState({
        client: '0',
        destinyState: '0',
        destinyCity: '0',
        dueDate: new Date().toISOString().substring(0, 10),
        items: [],
        weight: '',
        types: [],
      });
      component.state.budget.saleBudget = undefined;
    }
  };
  handleRepresentationChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { budget } = component.state;
    const { productsDb, itemQuantity, representations } = (
      component.itemRef.current as FormFreightItem
    ).state;
    component.setState({ representation: e.target.value });
    if (e.target.value != '0') {
      (component.itemRef.current as FormFreightItem).setState({
        itemRepresentation: e.target.value,
      });
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) => item.representation.id == Number(e.target.value),
      );
      (component.itemRef.current as FormFreightItem).setState({ products: newProducts });
      if (newProducts.length > 0) {
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as IProduct;
        (component.itemRef.current as FormFreightItem).setState({
          item: newProducts[0].id.toString(),
          itemWeight: formatarPeso(product.weight),
          itemQuantity: 1,
          totalItemWeight: formatarValor(product.weight * itemQuantity),
        });
      }
      const r = representations.find(
        (x) => x.id == Number(e.target.value),
      ) as Representation;
      budget.representation = r.toAttributes;
      component.setState({
        items: [],
        weight: '',
        price: '',
        salesBudget: '0',
        client: '0',
        destinyState: '0',
        destinyCity: '0',
        dueDate: new Date().toISOString().substring(0, 10),
        types: [],
      });
      budget.saleBudget = undefined;
    } else budget.representation = undefined;
  };
  handleClientChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ client: e.target.value });
    new Validate(component, this.functions).client(e.target.value);
  };

  handleClearItemsClick = (component: FreightBudgetComponent) => {
    component.setState({
      items: [],
      weight: '',
      price: '',
      types: [],
    });
  };

  handleDestinyStateChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ destinyState: e.target.value });
    new Validate(component, this.functions).destinyState(e.target.value);
  };
  handleDestinyCityChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ destinyCity: e.target.value });
    new Validate(component, this.functions).destinyCity(e.target.value);
  };
  handleTruckTypeChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ truckType: e.target.value });
    new Validate(component, this.functions).type(e.target.value);
  };
  handleDistanceChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ distance: Number.parseInt(e.target.value) });
    new Validate(component, this.functions).distance(e.target.value);
  };

  handleWeightChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ weight: e.target.value });
    new Validate(component, this.functions).weight(e.target.value);
  };
  handlePriceChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ price: e.target.value });
    new Validate(component, this.functions).price(e.target.value);
  };
  handleShippingChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ shipping: e.target.value });
    new Validate(component, this.functions).shipping(e.target.value);
  };
  handleDueDateChange = (
    component: FreightBudgetComponent,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    component.setState({ dueDate: e.target.value });
    new Validate(component, this.functions).dueDate(e.target.value);
  };

  handleDelItemClick = (component: FreightBudgetComponent, item: IFreightItem) => {
    const { salesBudget, items, budget } = component.state;
    if (salesBudget == '0') {
      const newItems: IFreightItem[] = [];
      items.forEach((i) => {
        if (i.product.id != item.product.id) newItems.push(i);
      });
      let totalWeight = 0.0;
      totalWeight = Number.parseFloat(totalWeight.toString());
      newItems.forEach(
        (item) => (totalWeight += Number.parseFloat(item.weight.toString())),
      );
      totalWeight = Number.parseFloat(totalWeight.toString());
      budget.weight = totalWeight;
      const newTypes: ITruckType[] = [];
      newItems.forEach((i) => {
        for (const t of i.product.types) {
          const exists = newTypes.find((it) => it.id == t.id);
          if (!exists) newTypes.push(t);
        }
      });
      component.setState({
        items: newItems,
        weight: formatarPeso(totalWeight),
        types: newTypes,
      });
    }
  };
}
