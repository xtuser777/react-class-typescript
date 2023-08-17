import { FormSaleItem } from '.';
import { Product } from '../../models/Product';
import { Representation } from '../../models/Representation';
import { formatarValor } from '../../utils/format';

export class Validate {
  private component: FormSaleItem;

  constructor(component: FormSaleItem) {
    this.component = component;
  }

  itemRepresentation = (value: string) => {
    const { representations, productsDb, itemQuantity } = this.component.state;
    if (value == '0') {
      this.component.setState({
        errorItemRepresentation: 'A representação do item precisa ser selecionada.',
      });
      return false;
    } else {
      this.component.setState({ errorItemRepresentation: undefined });
      this.component.setState({ itemFilter: '' });
      if (representations.length > 0) {
        let newProducts = [...productsDb];
        const representation = representations.find(
          (i) => i.id == Number(value),
        ) as Representation;
        newProducts = newProducts.filter(
          (item) => item.representation.id == representation.id,
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
      return true;
    }
  };

  item = (value: string) => {
    const { products, itemQuantity } = this.component.state;
    if (value == '0' || products.length == 0) {
      this.component.setState({ errorItem: 'O item precisa ser selecionado.' });
      return false;
    } else {
      const product = products.find((item) => item.id == Number(value)) as Product;
      const itemProduct = this.component.props.items.find(
        (i) => i.product.id == product.id,
      );
      if (itemProduct) {
        this.component.setState({ errorItem: 'Este item já foi adicionado.' });
        return false;
      } else {
        this.component.setState({ errorItem: undefined });

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
        return true;
      }
    }
  };

  itemPrice = (value: string) => {
    if (value.length == 0) {
      this.component.setState({
        errorItemPrice: 'O preço do item precisa ser preenchido.',
      });
      return false;
    } else if (
      Number.parseFloat(value.replace(',', '#').replaceAll('.', ',').replace('#', '.')) <=
      0
    ) {
      this.component.setState({
        errorItemPrice: 'O preço do item informado é inválido.',
      });
      return false;
    } else {
      this.component.setState({ errorItemPrice: undefined });
      return true;
    }
  };

  itemQuantity = (value: string) => {
    const val = Number(value);
    if (val <= 0) {
      this.component.setState({
        errorItemQuantity: 'A quantidade do item precisa ser preenchida.',
      });
      return false;
    } else {
      this.component.setState({ errorItemQuantity: undefined });
      //const product = products.find((i) => i.id == Number(item)) as Product;
      const price = Number.parseFloat(
        this.component.state.itemPrice
          .replace(',', '#')
          .replaceAll('.', ',')
          .replace('#', '.'),
      );
      this.component.setState({ totalItemPrice: formatarValor(price * val) });
      return true;
    }
  };

  totalItemPrice = (value: string) => {
    if (value.length == 0) {
      this.component.setState({
        errorTotalItemPrice: 'O preço total do item precisa ser preenchido.',
      });
      return false;
    } else if (
      Number.parseFloat(value.replace(',', '#').replaceAll('.', ',').replace('#', '.')) <=
      0
    ) {
      this.component.setState({
        errorTotalItemPrice: 'O preço total do item informado é inválido.',
      });
      return false;
    } else {
      this.component.setState({ errorTotalItemPrice: undefined });
      return true;
    }
  };
}
