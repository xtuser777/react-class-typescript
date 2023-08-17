import { ChangeEvent, Component } from 'react';
import { IFreightItem } from '../models/FreightItem';
import { Row, Col, FormGroup, Label, Input, Badge } from 'reactstrap';
import history from '../services/history';
import { FieldsetCard } from './fieldset-card';
import { FormButton } from './form-button';
import { FormInputGroupText } from './form-input-group-text';
import { FormInputNumber } from './form-input-number';
import { IRepresentation, Representation } from '../models/Representation';
import { IProduct, Product } from '../models/Product';
import { toast } from 'react-toastify';
import { formatarPeso, formatarValor } from '../utils/format';
import { ITruckType } from '../models/TruckType';
import { IFreightBudget } from '../models/FreightBudget';

interface IFormFreightItemProps {
  changeItem: (items: IFreightItem[], totalWeight: string, types: ITruckType[]) => void;
  setErrorType: (value?: string) => void;
  budget: IFreightBudget;
  items: IFreightItem[];
  types: ITruckType[];
  representation: string;
}

interface IFormFreightItemState {
  representations: Array<IRepresentation>;
  representationsDb: Array<IRepresentation>;
  products: Array<IProduct>;
  productsDb: Array<IProduct>;
  itemRepresentation: string;
  itemRepresentationFilter: string;
  item: string;
  itemFilter: string;
  itemWeight: string;
  itemQuantity: number;
  totalItemWeight: string;
  errorItemRepresentation?: string | undefined;
  errorItem?: string | undefined;
  errorItemWeight?: string | undefined;
  errorItemQuantity?: string | undefined;
  errorTotalItemWeight?: string | undefined; //
}

export class FormFreightItem extends Component<
  IFormFreightItemProps,
  IFormFreightItemState
> {
  constructor(props: IFormFreightItemProps) {
    super(props);
    this.state = {
      representations: new Array<IRepresentation>(),
      representationsDb: new Array<IRepresentation>(),
      products: new Array<IProduct>(),
      productsDb: new Array<IProduct>(),
      itemRepresentation: '0',
      itemRepresentationFilter: '',
      item: '0',
      itemFilter: '',
      itemWeight: '',
      itemQuantity: 1,
      totalItemWeight: '',
    };
  }

  getRepresentations = async (products: IProduct[]) => {
    const response = await new Representation().get();
    if (response.length == 0) {
      toast.info('Não há representações cadastradas.');
      history.push('/representacoes');
      window.location.reload();
    }
    this.setState({ representations: response, representationsDb: response });

    this.setState({ itemRepresentation: response[0].id.toString() });
    let newProducts = [...products];
    newProducts = newProducts.filter((item) => item.representation.id == response[0].id);
    this.setState({ products: newProducts });
    if (newProducts.length > 0) {
      const product = newProducts.find(
        (item) => item.id == newProducts[0].id,
      ) as IProduct;
      this.setState({
        item: newProducts[0].id.toString(),
        itemWeight: formatarPeso(product.weight),
        itemQuantity: 1,
        totalItemWeight: formatarValor(product.weight * this.state.itemQuantity),
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
    this.setState({ productsDb: response });
    return response;
  };

  async componentDidMount() {
    await this.getRepresentations(await this.getProducts());
  }

  validate = {
    itemRepresentation: (value: string) => {
      const { representations, productsDb, itemQuantity } = this.state;
      if (value == '0') {
        this.setState({
          errorItemRepresentation: 'A representação do item precisa ser selecionada.',
        });
        return false;
      } else {
        this.setState({ errorItemRepresentation: undefined });
        this.setState({ itemFilter: '' });
        if (representations.length > 0) {
          let newProducts = [...productsDb];
          const representation = representations.find(
            (i) => i.id == Number(value),
          ) as Representation;
          newProducts = newProducts.filter(
            (item) => item.representation.id == representation.id,
          );
          this.setState({ products: newProducts });
          if (newProducts.length > 0) {
            const product = newProducts.find(
              (item) => item.id == newProducts[0].id,
            ) as Product;
            this.setState({ item: newProducts[0].id.toString() });
            this.setState({ itemWeight: formatarPeso(product.weight) });
            this.setState({ itemQuantity: 1 });
            this.setState({
              totalItemWeight: formatarPeso(product.weight * itemQuantity),
            });
          }
        }
        return true;
      }
    },
    item: (value: string) => {
      const { products, itemQuantity } = this.state;
      if (value == '0' || products.length == 0) {
        this.setState({ errorItem: 'O item precisa ser selecionado.' });
        return false;
      } else {
        const product = products.find((item) => item.id == Number(value)) as Product;
        const itemProduct = this.props.items.find((i) => i.product.id == product.id);
        if (itemProduct) {
          this.setState({ errorItem: 'Este item já foi adicionado.' });
          return false;
        } else {
          let typesCommon = 0;
          product.types.forEach((x) => {
            this.props.types.forEach((y) => {
              if (x.id == y.id) typesCommon++;
            });
          });

          if (this.props.items.length > 0 && typesCommon == 0) {
            this.props.setErrorType(
              'Este produto não pode ser carregado junto os outros já adicionados.',
            );
            return false;
          }

          this.setState({ errorItem: undefined });

          this.setState({
            itemWeight: formatarPeso(product.weight),
            itemQuantity: 1,
            totalItemWeight: formatarPeso(product.weight * itemQuantity),
          });
          return true;
        }
      }
    },
    itemWeight: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorItemWeight: 'O peso do item precisa ser preenchido.' });
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        this.setState({ errorItemWeight: 'O peso do item informado é inválido.' });
        return false;
      } else {
        this.setState({ errorItemWeight: undefined });
        return true;
      }
    },
    itemQuantity: (value: string) => {
      const val = Number(value);
      if (val <= 0) {
        this.setState({
          errorItemQuantity: 'A quantidade do item precisa ser preenchida.',
        });
        return false;
      } else {
        this.setState({ errorItemQuantity: undefined });
        //const product = products.find((i) => i.id == Number(item)) as Product;
        const weight = Number.parseFloat(
          this.state.itemWeight.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        this.setState({ totalItemWeight: formatarValor(weight * val) });
        return true;
      }
    },
    totalItemWeight: (value: string) => {
      if (value.length == 0) {
        this.setState({
          errorTotalItemWeight: 'O peso total do item precisa ser preenchido.',
        });
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        this.setState({
          errorTotalItemWeight: 'O peso total do item informado é inválido.',
        });
        return false;
      } else {
        this.setState({ errorTotalItemWeight: undefined });
        return true;
      }
    },
  };

  handleItemRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ itemRepresentation: e.target.value });
    this.validate.itemRepresentation(e.target.value);
  };
  handleItemRepresentationFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { representationsDb, productsDb, itemQuantity } = this.state;
    let newRepresentations: IRepresentation[] = [];
    if (e.target.value.trim().length > 0) {
      this.clearItemFields();
      this.setState({ itemRepresentationFilter: e.target.value });
      newRepresentations = [...representationsDb];
      newRepresentations = newRepresentations.filter(
        (item) =>
          item.person.enterprise?.fantasyName.includes(e.target.value) ||
          item.unity.includes(e.target.value),
      );
    } else {
      this.clearItemFields();
      this.setState({ itemRepresentationFilter: e.target.value });
      newRepresentations = [...representationsDb];
    }
    this.setState({ representations: newRepresentations });
    if (newRepresentations.length > 0) {
      this.setState({
        itemFilter: '',
        itemRepresentation: newRepresentations[0].id.toString(),
      });
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) => item.representation.id == newRepresentations[0].id,
      );
      this.setState({ products: newProducts });
      if (newProducts.length > 0) {
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as Product;
        this.setState({
          item: newProducts[0].id.toString(),
          itemWeight: formatarValor(product.weight),
          itemQuantity: 1,
          totalItemWeight: formatarValor(product.weight * itemQuantity),
        });
      }
    }
  };
  handleItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ item: e.target.value });
    this.validate.item(e.target.value);
  };
  handleItemFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { productsDb, itemRepresentation, itemQuantity } = this.state;
    this.setState({ itemFilter: e.target.value });
    if (e.target.value.trim().length > 0) {
      this.setState({
        itemWeight: '',
        itemQuantity: 1,
        totalItemWeight: '',
      });
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) =>
          item.representation.id == Number(itemRepresentation) &&
          item.description.includes(e.target.value),
      );
      this.setState({ products: newProducts });
      if (newProducts.length > 0) {
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as Product;
        this.setState({
          item: product.id.toString(),
          itemWeight: formatarValor(product.weight),
          itemQuantity: 1,
          totalItemWeight: formatarValor(product.weight * itemQuantity),
        });
      }
    }
  };

  handleItemWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ itemWeight: e.target.value });
    this.validate.itemWeight(e.target.value);
  };
  handleItemQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ itemQuantity: Number.parseInt(e.target.value) });
    this.validate.itemQuantity(e.target.value);
  };
  handleTotalItemWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ totalItemWeight: e.target.value });
    this.validate.totalItemWeight(e.target.value);
  };

  clearItemFields = () => {
    const { representationsDb, products, itemQuantity } = this.state;
    const newRepresentations = [...representationsDb];
    let newProducts = [...products];
    newProducts = newProducts.filter(
      (item) => item.representation.id == newRepresentations[0].id,
    );
    this.setState({
      itemRepresentationFilter: '',
      representations: newRepresentations,
      itemFilter: '',
      products: newProducts,
    });
    if (newProducts.length > 0) {
      const product = newProducts.find(
        (item) => item.id == newProducts[0].id,
      ) as IProduct;
      this.setState({
        item: newProducts[0].id.toString(),
        itemWeight: formatarPeso(product.weight),
        itemQuantity: 1,
        totalItemWeight: formatarPeso(product.weight * itemQuantity),
      });
    }
  };

  validateItemFields = () => {
    const { item, itemRepresentation, itemWeight, itemQuantity, totalItemWeight } =
      this.state;
    return (
      this.validate.itemRepresentation(itemRepresentation) &&
      this.validate.item(item) &&
      this.validate.itemWeight(itemWeight) &&
      this.validate.itemQuantity(itemQuantity.toString()) &&
      this.validate.totalItemWeight(totalItemWeight)
    );
  };

  handleClearItemClick = () => {
    this.clearItemFields();
  };
  handleAddItemClick = () => {
    const { products, item, itemQuantity } = this.state;
    if (this.validateItemFields()) {
      const newItems = [...this.props.items];
      const product = (products.find((i) => i.id == Number(item)) as Product)
        .toAttributes;
      newItems.push({
        id: 0,
        product: product,
        quantity: itemQuantity,
        weight: product.weight * itemQuantity,
        budget: this.props.budget,
      });
      let totalWeight = 0.0;
      totalWeight = Number.parseFloat(totalWeight.toString());
      newItems.forEach(
        (item) => (totalWeight += Number.parseFloat(item.weight.toString())),
      );
      const newTypes = [...this.props.types];
      for (const t of product.types) {
        const exists = newTypes.find((i) => i.id == t.id);
        if (!exists) newTypes.push(t);
      }
      totalWeight = Number.parseFloat(totalWeight.toString());
      this.props.budget.weight = totalWeight;
      this.props.changeItem(newItems, formatarPeso(totalWeight), newTypes);
    }
  };

  render() {
    const {
      representations,
      products,
      itemRepresentation,
      itemRepresentationFilter,
      item,
      itemFilter,
      itemWeight,
      itemQuantity,
      totalItemWeight,
      errorItemRepresentation,
      errorItem,
      errorItemWeight,
      errorItemQuantity,
      errorTotalItemWeight, //
    } = this.state;

    return (
      <FieldsetCard legend="Adicionar Item" obrigatoryFields>
        <Row>
          <Col sm="6">
            <FormGroup>
              <Label for="filtro-representacao-item">
                Representação <span style={{ color: 'red' }}>*</span> :
              </Label>
              <Input
                type="text"
                id="filtro-representacao-item"
                bsSize="sm"
                style={{ width: '100%', marginBottom: '5px' }}
                value={itemRepresentationFilter}
                onChange={this.handleItemRepresentationFilterChange}
              />
              <Input
                type="select"
                id="representacao-item"
                bsSize="sm"
                style={{ width: '100%' }}
                value={itemRepresentation}
                onChange={this.handleItemRepresentationChange}
                disabled={this.props.representation == '0' ? false : true}
              >
                {representations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.person.enterprise?.fantasyName + ' (' + item.unity + ')'}
                  </option>
                ))}
              </Input>
              <Badge
                id={`ms-representacao-item`}
                color="danger"
                className={errorItemRepresentation ? 'hidden' : ''}
              >
                {errorItemRepresentation ? errorItemRepresentation : ''}
              </Badge>
            </FormGroup>
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label for="filtro-item">
                Produto <span style={{ color: 'red' }}>*</span> :
              </Label>
              <Input
                type="text"
                id="filtro-item"
                bsSize="sm"
                style={{ width: '100%', marginBottom: '5px' }}
                value={itemFilter}
                onChange={this.handleItemFilterChange}
              />
              <Input
                type="select"
                id="item"
                bsSize="sm"
                style={{ width: '100%' }}
                value={item}
                onChange={this.handleItemChange}
              >
                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.description}
                  </option>
                ))}
              </Input>
              <Badge id={`ms-item`} color="danger" className={errorItem ? 'hidden' : ''}>
                {errorItem ? errorItem : ''}
              </Badge>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <FormInputGroupText
            colSm={3}
            id="peso-produto"
            label="Peso"
            groupText={'KG'}
            obrigatory
            mask="##0,0"
            maskReversal={true}
            maskPlaceholder="0,0"
            value={itemWeight}
            onChange={this.handleItemWeightChange}
            readonly
            message={errorItemWeight}
          />
          <FormInputNumber
            colSm={2}
            id="quantidade-item"
            label="Qtde desejada"
            obrigatory
            value={itemQuantity}
            onChange={this.handleItemQuantityChange}
            message={errorItemQuantity}
          />
          <FormInputGroupText
            colSm={3}
            id="peso-total-item"
            label="Peso Total"
            groupText={'KG'}
            obrigatory
            mask="##0,0"
            maskReversal={true}
            maskPlaceholder="0,0"
            value={totalItemWeight}
            onChange={this.handleTotalItemWeightChange}
            readonly
            message={errorTotalItemWeight}
          />
          <FormButton
            colSm={2}
            color="primary"
            id="limpar-item"
            text="LIMPAR"
            onClick={this.handleClearItemClick}
          />
          <FormButton
            colSm={2}
            color="success"
            id="adicionar-item"
            text="ADICIONAR"
            onClick={this.handleAddItemClick}
          />
        </Row>
      </FieldsetCard>
    );
  }
}
