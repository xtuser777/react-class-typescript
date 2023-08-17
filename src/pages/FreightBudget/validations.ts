import { toast } from 'react-toastify';
import { ICity } from '../../models/City';
import { ITruckType } from '../../models/TruckType';
import { calculateMinimumFloor } from '../../utils/calc';
import { formatarValor } from '../../utils/format';
import { Client } from '../../models/Client';
import { FreightBudgetFunctions } from './functions';
import { FreightBudgetComponent } from './component';

export class Validate {
  private component: FreightBudgetComponent;
  private functions: FreightBudgetFunctions;

  constructor(component: FreightBudgetComponent, functions: FreightBudgetFunctions) {
    this.component = component;
    this.functions = functions;
  }
  description = (value: string) => {
    if (value.length == 0) {
      this.component.setState({
        errorDescription: 'A descrição do orçamento precisa ser preenchida.',
      });
      return false;
    } else if (value.length < 2) {
      this.component.setState({
        errorDescription: 'A descrição preenchida tem tamanho inválido.',
      });
      return false;
    } else {
      this.component.setState({ errorDescription: undefined });
      this.component.state.budget.description = value;
      return true;
    }
  };
  client = (value: string) => {
    if (value == '0') {
      this.component.setState({ errorClient: 'O cliente precisa ser selecionado.' });
      return false;
    } else {
      this.component.setState({ errorClient: undefined });
      this.component.state.budget.client = (
        this.component.state.clients.find((item) => item.id == Number(value)) as Client
      ).toAttributes;
      return true;
    }
  };
  destinyState = (value: string) => {
    if (value == '0') {
      this.component.setState({ errorDestinyState: 'O Estado precisa ser selecionado' });
      return false;
    } else {
      this.component.setState({ errorDestinyState: undefined });
      this.component.setState({
        cities: this.component.state.states[Number(value) - 1].cities,
      });
      return true;
    }
  };
  destinyCity = (value: string) => {
    if (value == '0') {
      this.component.setState({ errorDestinyCity: 'A cidade precisa ser selecionada' });
      return false;
    } else {
      this.component.setState({ errorDestinyCity: undefined });
      const city = this.component.state.cities.find(
        (item) => item.id == Number(value),
      ) as ICity;
      this.component.state.budget.destiny = city;
      return true;
    }
  };
  type = (value: string) => {
    if (value == '0') {
      this.component.setState({
        errorType: 'O tipo de caminhão precisa ser selecionado.',
      });
      return false;
    } else {
      this.component.setState({ errorType: undefined });
      const t = this.component.state.types.find(
        (item) => item.id == Number(value),
      ) as ITruckType;

      if (
        Number.parseFloat(
          this.component.state.budget.weight
            .toString()
            .replace(',', '#')
            .replaceAll('.', ',')
            .replace('#', '.'),
        ) > t.capacity
      ) {
        this.component.setState({ errorType: 'O tipo de caminhão não suporta a carga.' });
        return false;
      }

      this.component.state.budget.truckType = t;
      return true;
    }
  };
  distance = (value: string) => {
    const { truckType, budget } = this.component.state;
    const v = Number(value);
    if (Number.isNaN(v)) {
      this.component.setState({
        errorDistance: 'A distância do frete precisa ser preenchida.',
      });
      return false;
    } else if (v <= 0) {
      this.component.setState({ errorDistance: 'A distância preenchida é inválida.' });
      return false;
    } else if (truckType == '0') {
      this.component.setState({
        errorDistance: 'o Tipo de caminhão precisa ser selecionado primeiro.',
      });
      return false;
    } else {
      this.component.setState({ errorDistance: undefined });

      const t = this.component.state.types.find(
        (x) => x.id == Number(this.component.state.truckType),
      ) as ITruckType;
      const piso = t.axes > 3 ? calculateMinimumFloor(Number(value), t.axes) : 1.0;
      this.component.setState({ price: formatarValor(piso), minimumFloor: piso });

      budget.distance = v;
      if (budget.value < piso) budget.value = piso;
      return true;
    }
  };
  weight = (value: string) => {
    if (value.length == 0) {
      this.component.setState({ errorWeight: 'O peso do frete precisa ser preenchido.' });
      return false;
    } else if (
      Number.parseFloat(value.replace(',', '#').replaceAll('.', ',').replace('#', '.')) <=
      0
    ) {
      this.component.setState({ errorWeight: 'O peso do frete informado é inválido.' });
      return false;
    } else {
      this.component.setState({ errorWeight: undefined });
      this.component.state.budget.weight = Number.parseFloat(
        value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
      );
      return true;
    }
  };
  price = (value: string) => {
    const { budget, minimumFloor } = this.component.state;
    if (value.length == 0) {
      this.component.setState({ errorPrice: 'O preço do frete precisa ser preenchido.' });
      return false;
    } else if (
      Number.parseFloat(value.replace(',', '#').replaceAll('.', ',').replace('#', '.')) <
      minimumFloor
    ) {
      this.component.setState({
        errorPrice: 'O preço do frete informado é inválido ou abaixo do piso.',
      });
      return false;
    } else {
      this.component.setState({ errorPrice: undefined });
      budget.value = Number.parseFloat(
        value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
      );
      return true;
    }
  };
  shipping = (value: string) => {
    const val = new Date(value + 'T12:00:00');
    const now = new Date(Date.now());
    if (value.length == 0) {
      this.component.setState({
        errorShipping: 'A data de entrega precisa ser preenchida',
      });
      return false;
    } else if (
      now.getFullYear() == val.getFullYear() &&
      now.getMonth() == val.getMonth() &&
      now.getDate() > val.getDate()
    ) {
      this.component.setState({
        errorShipping: 'A data de entrega preenchida é inválida',
      });
      return false;
    } else {
      this.component.setState({ errorShipping: undefined });
      this.component.state.budget.shipping = value;
      return true;
    }
  };
  dueDate = (value: string) => {
    const val = new Date(value + 'T12:00:00');
    const now = new Date(Date.now());
    if (value.length == 0) {
      this.component.setState({
        errorDueDate: 'A data de validade precisa ser preenchida',
      });
      return false;
    } else if (
      now.getFullYear() == val.getFullYear() &&
      now.getMonth() == val.getMonth() &&
      now.getDate() > val.getDate()
    ) {
      this.component.setState({
        errorDueDate: 'A data de validade preenchida é inválida',
      });
      return false;
    } else {
      this.component.setState({ errorDueDate: undefined });
      this.component.state.budget.validate = value;
      return true;
    }
  };
  items = () => {
    const { budget, items } = this.component.state;
    if (items.length == 0) {
      toast.info('Não há itens adicionados ao orçamento.');
      return false;
    } else {
      budget.items = this.functions.filterItems();
      return true;
    }
  };
}
