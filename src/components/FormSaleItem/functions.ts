import { toast } from 'react-toastify';
import history from '../../services/history';
import { Product } from '../../models/Product';
import { Representation } from '../../models/Representation';
import { formatarValor } from '../../utils/format';
import { Validate } from './validations';
import { FormSaleItem } from '.';

export class FormSaleItemFunctions {
  private component: FormSaleItem;
  private validate: Validate;

  constructor(component: FormSaleItem) {
    this.component = component;
    this.validate = new Validate(component);
  }

  getRepresentations = async (products: Product[]) => {
    const response = await new Representation().get();
    if (response.length == 0) {
      toast.info('Não há representações cadastradas.');
      history.push('/representacoes');
      window.location.reload();
    }
    this.component.setState({
      representations: response,
      representationsDb: response,
      itemRepresentation: response[0].id.toString(),
    });
    let newProducts = [...products];
    newProducts = newProducts.filter((item) => item.representation.id == response[0].id);
    this.component.setState({ products: newProducts });
    if (newProducts.length > 0) {
      this.component.setState({ item: newProducts[0].id.toString() });
      const product = newProducts.find((item) => item.id == newProducts[0].id) as Product;
      this.component.setState({
        itemPrice: formatarValor(product.price),
        itemQuantity: 1,
        totalItemPrice: formatarValor(product.price * this.component.state.itemQuantity),
      });
    }
  };

  getProducts = async () => {
    const response = await new Product().get();
    if (response.length == 0) {
      toast.info('Não há produtos cadastrados.');
      history.push('/produtos');
      window.location.reload();
    }
    this.component.setState({ productsDb: response });
    return response;
  };

  clearItemFields = () => {
    const { representationsDb, products, itemQuantity } = this.component.state;
    this.component.setState({ itemRepresentationFilter: '' });
    const newRepresentations = [...representationsDb];
    this.component.setState({ representations: newRepresentations });
    this.component.setState({ itemFilter: '' });
    let newProducts = [...products];
    newProducts = newProducts.filter(
      (item) => item.representation.id == newRepresentations[0].id,
    );
    this.component.setState({ products: newProducts });
    if (newProducts.length > 0) {
      this.component.setState({ item: newProducts[0].id.toString() });
      const product = newProducts.find((item) => item.id == newProducts[0].id) as Product;
      this.component.setState({ itemPrice: formatarValor(product.price) });
      this.component.setState({ itemQuantity: 1 });
      this.component.setState({
        totalItemPrice: formatarValor(product.price * itemQuantity),
      });
    }
  };

  validateItemFields = () => {
    const { itemRepresentation, item, itemPrice, itemQuantity, totalItemPrice } =
      this.component.state;
    return (
      this.validate.itemRepresentation(itemRepresentation) &&
      this.validate.item(item) &&
      this.validate.itemPrice(itemPrice) &&
      this.validate.itemQuantity(itemQuantity.toString()) &&
      this.validate.totalItemPrice(totalItemPrice)
    );
  };
}
