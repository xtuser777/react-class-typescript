import { ChangeEvent } from 'react';
import { Product } from '../../models/Product';
import { IRepresentation } from '../../models/Representation';
import { formatarValor, formatarPeso } from '../../utils/format';
import { FormSaleItemFunctions } from './functions';
import { Validate } from './validations';
import { FormSaleItem } from '.';

export class FormSaleItemHandles {
  private component: FormSaleItem;
  private functions: FormSaleItemFunctions;
  private validate: Validate;

  constructor(component: FormSaleItem, functions: FormSaleItemFunctions) {
    this.component = component;
    this.functions = functions;
    this.validate = new Validate(component);
  }

  handleItemRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ itemRepresentation: e.target.value });
    this.validate.itemRepresentation(e.target.value);
  };
  handleItemRepresentationFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { representationsDb, productsDb, itemQuantity } = this.component.state;
    let newRepresentations: IRepresentation[] = [];
    if (e.target.value.trim().length > 0) {
      this.functions.clearItemFields();
      this.component.setState({ itemRepresentationFilter: e.target.value });
      newRepresentations = [...representationsDb];
      newRepresentations = newRepresentations.filter(
        (item) =>
          item.person.enterprise?.fantasyName.includes(e.target.value) ||
          item.unity.includes(e.target.value),
      );
    } else {
      this.functions.clearItemFields();
      this.component.setState({ itemRepresentationFilter: e.target.value });
      newRepresentations = [...representationsDb];
    }
    this.component.setState({ representations: newRepresentations });
    if (newRepresentations.length > 0) {
      this.component.setState({ itemFilter: '' });
      this.component.setState({
        itemRepresentation: newRepresentations[0].id.toString(),
      });
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) => item.representation.id == newRepresentations[0].id,
      );
      this.component.setState({ products: newProducts });
      if (newProducts.length > 0) {
        this.component.setState({ item: newProducts[0].id.toString() });
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as Product;
        this.component.setState({
          itemPrice: formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(this.component.props.destinyState)
              ? product.price
              : product.priceOut,
          ),
        });
        this.component.setState({ itemQuantity: 1 });
        this.component.setState({
          totalItemPrice: formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(this.component.props.destinyState)
              ? product.price * itemQuantity
              : product.priceOut * itemQuantity,
          ),
        });
      }
    }
  };
  handleItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ item: e.target.value });
    this.validate.item(e.target.value);
  };
  handleItemFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { productsDb, itemRepresentation, itemQuantity } = this.component.state;
    this.component.setState({ itemFilter: e.target.value });
    if (e.target.value.trim().length > 0) {
      this.component.setState({ itemPrice: '' });
      this.component.setState({ itemQuantity: 1 });
      this.component.setState({ totalItemPrice: '' });
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) =>
          item.representation.id == Number(itemRepresentation) &&
          item.description.includes(e.target.value),
      );
      this.component.setState({ products: newProducts });
      if (newProducts.length > 0) {
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as Product;
        this.component.setState({ item: product.id.toString() });
        this.component.setState({
          itemPrice: formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(this.component.props.destinyState)
              ? product.price
              : product.priceOut,
          ),
        });
        this.component.setState({ itemQuantity: 1 });
        this.component.setState({
          totalItemPrice: formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(this.component.props.destinyState)
              ? product.price * itemQuantity
              : product.priceOut * itemQuantity,
          ),
        });
      }
    }
  };

  handleItemPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ itemPrice: e.target.value });
    this.validate.itemPrice(e.target.value);
  };
  handleItemQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ itemQuantity: Number.parseInt(e.target.value) });
    this.validate.itemQuantity(e.target.value);
  };
  handleTotalItemPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.component.setState({ totalItemPrice: e.target.value });
    this.validate.totalItemPrice(e.target.value);
  };

  handleClearItemClick = () => {
    this.functions.clearItemFields();
  };
  handleAddItemClick = () => {
    const { products, item, itemQuantity, totalItemPrice } = this.component.state;
    if (this.functions.validateItemFields()) {
      const newItems = [...this.component.props.items];
      const product = (products.find((i) => i.id == Number(item)) as Product)
        .toAttributes;
      newItems.push({
        id: 0,
        product: product,
        quantity: itemQuantity,
        weight: product.weight * itemQuantity,
        price: Number.parseFloat(
          totalItemPrice.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ),
      });
      let totalWeight = 0.0;
      totalWeight = Number.parseFloat(totalWeight.toString());
      newItems.forEach(
        (item) => (totalWeight += Number.parseFloat(item.weight.toString())),
      );
      totalWeight = Number.parseFloat(totalWeight.toString());

      let totalPrice = 0.0;
      totalPrice = Number.parseFloat(totalPrice.toString());
      newItems.forEach(
        (item) => (totalPrice += Number.parseFloat(item.price.toString())),
      );
      totalPrice = Number.parseFloat(totalPrice.toString());

      this.component.props.changeItem(
        newItems,
        formatarPeso(totalWeight),
        formatarValor(totalPrice),
      );
    }
  };
}
