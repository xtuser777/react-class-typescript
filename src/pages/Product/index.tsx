import React, { ChangeEvent, Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Button, Col, Row, Table } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { Product as ProductModel } from '../../models/Product';
import { IRepresentation, Representation } from '../../models/Representation';
import { formatarPeso, formatarValor } from '../../utils/format';
import { ITruckType, TruckType } from '../../models/TruckType';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import history from '../../services/history';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  product: ProductModel;
  representations: IRepresentation[];
  types: ITruckType[];
  typesLinked: ITruckType[];
  description: string;
  representation: string;
  measure: string;
  weight: string;
  price: string;
  priceOut: string;
  type: string;
  errorTypesLinked?: string;
  errorDescription?: string;
  errorRepresentation?: string;
  errorMeasure?: string;
  errorWeight?: string;
  errorPrice?: string;
  errorPriceOut?: string;
  errorType?: string;
}

class Product extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;

  constructor(props: IComponentProps) {
    super(props);

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = {
      product: new ProductModel(),
      representations: [],
      types: [],
      typesLinked: [],
      description: '',
      representation: '0',
      measure: '',
      weight: '',
      price: '',
      priceOut: '',
      type: '0',
    };
  }

  getRepresentations = async () => {
    const data = await new Representation().get();
    if (data.length == 0) {
      toast.info('Não existem representações cadastradas.');
      history.push('/produtos');
      history.go(1);
    }
    this.setState({ representations: data });
  };

  getTypes = async () => {
    const data = await new TruckType().get();
    this.setState({ types: data });
  };

  getData = async () => {
    const data = await new ProductModel().getOne(this.id);
    if (data) {
      this.setState({
        product: data,
        description: data.description,
        representation: data.representation.id.toString(),
        measure: data.measure,
        weight: formatarPeso(data.weight),
        price: formatarValor(data.price),
        priceOut: formatarValor(data.priceOut),
        typesLinked: data.types,
      });
    }
  };

  async componentDidMount() {
    await this.getRepresentations();
    await this.getTypes();
    if (this.method == 'editar') this.getData();
  }

  validate = {
    description: (value: string) => {
      if (value.length == 0)
        this.setState({
          errorDescription: 'A descrição do produto precisa ser preenchida.',
        });
      else if (value.length < 2)
        this.setState({
          errorDescription: 'A descrição preenchida tem tamanho inválido.',
        });
      else {
        this.setState({ errorDescription: undefined });
        this.state.product.description = value;
      }
    },
    representation: (value: string) => {
      if (value == '0')
        this.setState({
          errorRepresentation: 'A representação do produto precisa ser preenchida.',
        });
      else {
        this.setState({ errorRepresentation: undefined });
        this.state.product.representation = (
          this.state.representations.find(
            (item) => item.id == Number(value),
          ) as Representation
        ).toAttributes;
      }
    },
    measure: (value: string) => {
      if (value.length == 0)
        this.setState({ errorMeasure: 'A unidade de medida precisa ser preenchida.' });
      else if (value.length < 2)
        this.setState({
          errorMeasure: 'A unidade de medida preenchida tem tamanho inválido.',
        });
      else {
        this.setState({ errorMeasure: undefined });
        this.state.product.measure = value;
      }
    },
    weight: (value: string) => {
      if (value.length == 0)
        this.setState({ errorWeight: 'O peso do produto precisa ser preenchido.' });
      else if (Number(value) <= 0)
        this.setState({ errorWeight: 'O peso do produto informado é inválido.' });
      else {
        this.setState({ errorWeight: undefined });
        this.state.product.weight = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
      }
    },
    price: (value: string) => {
      if (value.length == 0)
        this.setState({ errorPrice: 'O preço do produto precisa ser preenchido.' });
      else if (Number(value) <= 0)
        this.setState({ errorPrice: 'O preço do produto informado é inválido.' });
      else {
        this.setState({ errorPrice: undefined });
        this.state.product.price = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
      }
    },
    priceOut: (value: string) => {
      if (value.length == 0)
        this.setState({
          errorPriceOut: 'O preço fora do estado do produto precisa ser preenchido.',
        });
      else if (Number(value) <= 0)
        this.setState({ errorPriceOut: 'O preço fora do estado informado é inválido.' });
      else {
        this.setState({ errorPriceOut: undefined });
        this.state.product.priceOut = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
      }
    },
    types: () => {
      const { typesLinked } = this.state;
      if (typesLinked.length == 0)
        this.setState({
          errorTypesLinked: 'Os tipos do caminhão compatíveis precisam ser adicionados.',
        });
      else {
        this.setState({ errorTypesLinked: undefined });
        this.state.product.types = typesLinked;
      }
    },
  };

  handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: e.target.value });
    this.validate.description(e.target.value);
  };

  handleRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ representation: e.target.value });
    this.validate.representation(e.target.value);
  };

  handleMeasureChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ measure: e.target.value });
    this.validate.measure(e.target.value);
  };

  handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ weight: e.target.value });
    this.validate.weight(e.target.value);
  };

  handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: e.target.value });
    this.setState({ priceOut: e.target.value });
    this.validate.price(e.target.value);
  };

  handlePriceOutChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ priceOut: e.target.value });
    this.validate.priceOut(e.target.value);
  };

  handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ type: e.target.value });
    if (e.target.value == '0')
      this.setState({ errorType: 'O tipo de caminhão precisa ser selecinado.' });
    else this.setState({ errorType: undefined });
  };

  addType = () => {
    const { type, types, typesLinked } = this.state;
    if (type == '0')
      this.setState({ errorType: 'O tipo de caminhão precisa ser selecinado.' });
    else {
      this.setState({ errorType: undefined });
      let exists = undefined;
      if (typesLinked.length > 0)
        exists = typesLinked.find((item) => item.id == Number(type));
      if (!exists) {
        const newTypes = [...typesLinked];
        newTypes.push(
          (types.find((item) => item.id == Number(type)) as TruckType).toAttributes,
        );
        this.setState({ typesLinked: newTypes });
      }
    }
  };

  delType = (id: number) => {
    let newTypes = [...this.state.typesLinked];
    newTypes = newTypes.filter((type) => type.id != id);
    this.setState({ typesLinked: newTypes });
  };

  validateFields = () => {
    const {
      description,
      representation,
      measure,
      weight,
      price,
      priceOut,
      errorDescription,
      errorRepresentation,
      errorMeasure,
      errorPrice,
      errorPriceOut,
      errorWeight,
      errorTypesLinked,
    } = this.state;
    this.validate.description(description);
    this.validate.representation(representation);
    this.validate.measure(measure);
    this.validate.weight(weight);
    this.validate.price(price);
    this.validate.priceOut(priceOut);
    this.validate.types();

    return (
      !errorDescription &&
      !errorRepresentation &&
      !errorMeasure &&
      !errorWeight &&
      !errorPrice &&
      !errorPriceOut &&
      !errorTypesLinked
    );
  };

  clearFields = () => {
    this.setState({
      description: '',
      representation: '0',
      measure: '',
      weight: '',
      price: '',
      priceOut: '',
      typesLinked: [],
    });
  };

  persistData = async () => {
    const { product } = this.state;
    if (this.validateFields()) {
      if (this.method == 'novo') {
        if (await product.save()) this.clearFields();
      } else await product.update();
    }
  };

  render() {
    const {
      representations,
      types,
      typesLinked,
      description,
      representation,
      measure,
      weight,
      price,
      priceOut,
      type,
      errorDescription,
      errorRepresentation,
      errorMeasure,
      errorWeight,
      errorPrice,
      errorPriceOut,
      errorType,
    } = this.state;

    return (
      <>
        <CardTitle
          text={this.method == 'novo' ? 'Cadastrar Novo Produto' : 'Detalhes do Produto'}
        />
        <FieldsetCard legend="Dados do Produto" obrigatoryFields>
          <Row>
            <FormInputText
              colSm={7}
              id="descricao"
              label="Descrição"
              obrigatory
              value={description}
              onChange={(e) => this.handleDescriptionChange(e)}
              message={errorDescription}
            />
            <FormInputSelect
              colSm={5}
              id="representacao"
              label="Representação"
              obrigatory
              value={representation}
              onChange={(e) => this.handleRepresentationChange(e)}
              message={errorRepresentation}
            >
              <option value="0">SELECIONE</option>
              {representations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.person.enterprise?.fantasyName + ' (' + item.unity + ')'}
                </option>
              ))}
            </FormInputSelect>
          </Row>
          <Row>
            <FormInputText
              colSm={3}
              id="medida"
              label="Medida"
              obrigatory
              placeholder="Exemplo: Kg, Sacos de X Kg..."
              value={measure}
              onChange={(e) => this.handleMeasureChange(e)}
              message={errorMeasure}
            />
            <FormInputGroupText
              colSm={3}
              id="peso"
              label="Peso"
              groupText={'KG'}
              obrigatory
              mask="000.000,0"
              maskReversal={true}
              maskPlaceholder="0,0"
              value={weight}
              onChange={(e) => this.handleWeightChange(e)}
              message={errorWeight}
            />
            <FormInputGroupText
              colSm={3}
              id="preco"
              label="Preço"
              groupText={'R$'}
              obrigatory
              mask="00.000.000,00"
              maskReversal={true}
              value={price}
              onChange={(e) => this.handlePriceChange(e)}
              message={errorPrice}
            />
            <FormInputGroupText
              colSm={3}
              id="preco-out"
              label="Preço fora do estado"
              groupText={'R$'}
              obrigatory
              mask="00.000.000,00"
              maskReversal={true}
              value={priceOut}
              onChange={(e) => this.handlePriceOutChange(e)}
              message={errorPriceOut}
            />
          </Row>
        </FieldsetCard>
        <Row>
          <Col sm={5}>
            <FieldsetCard
              legend="Adicionar tipos de caminhão compatíveis"
              obrigatoryFields
            >
              <Row>
                <FormInputSelect
                  colSm={12}
                  id="tipocaminhao"
                  label="Tipo de Caminhão"
                  obrigatory
                  value={type}
                  onChange={(e) => this.handleTypeChange(e)}
                  message={errorType}
                >
                  <option value="0">SELECIONE</option>
                  {types.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.description + ' - ' + item.axes + ' Eixos'}
                    </option>
                  ))}
                </FormInputSelect>
              </Row>
              <Row>
                <Col sm="12" style={{ paddingTop: '18px' }}>
                  <Button
                    size="sm"
                    color="success"
                    id="adicionatipo"
                    onClick={this.addType}
                    style={{ width: '100%' }}
                  >
                    ADICIONAR TIPO
                  </Button>
                </Col>
              </Row>
            </FieldsetCard>
          </Col>
          <Col sm={7}>
            <FieldsetCard legend="Tipos de caminhão compatíveis">
              <Row>
                <div className="table-container" style={{ height: '150px' }}>
                  <Table id="tableLinks" size="sm" striped hover responsive>
                    <thead>
                      <tr>
                        <th className="hidden">ID</th>
                        <th style={{ width: '40%' }}>DESCRIÇÃO</th>
                        <th style={{ width: '16%' }}>EIXOS</th>
                        <th style={{ width: '10%' }}>CAPACIDADE</th>
                        <th style={{ width: '2%' }}>&nbsp;</th>
                      </tr>
                    </thead>

                    <tbody id="tbodyLinks">
                      {typesLinked.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.description}</td>
                          <td>{item.axes}</td>
                          <td>{item.capacity}</td>
                          <td>
                            <FaTrash
                              role="button"
                              color="red"
                              size={14}
                              title="Excluir"
                              onClick={() => this.delType(item.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Row>
            </FieldsetCard>
          </Col>
        </Row>
        <FormButtonsSave
          backLink="/produtos"
          clear={this.method == 'novo' ? true : false}
          save
          clearFields={this.clearFields}
          persistData={this.persistData}
        />
      </>
    );
  }
}

export default () => {
  return <Product params={useParams()} />;
};
