import React, { ChangeEvent, Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { IProduct, Product } from '../../models/Product';
import { IRepresentation, Representation } from '../../models/Representation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import history from '../../services/history';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { formatarValor } from '../../utils/format';

interface IComponentState {
  data: IProduct[];
  products: IProduct[];
  representations: IRepresentation[];
  filter: string;
  representation: string;
  orderBy: string;
}

export class Products extends Component<unknown, IComponentState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      data: [],
      products: [],
      representations: [],
      filter: '',
      representation: '0',
      orderBy: '1',
    };
  }

  getRepresentations = async () => {
    const data = await new Representation().get();
    this.setState({ representations: data });
  };

  getData = async () => {
    const data = await new Product().get();
    this.setState({
      data,
      products: data,
    });
  };

  async componentDidMount() {
    await this.getRepresentations();
    await this.getData();
  }

  filterData = (orderBy: string) => {
    const { data, representation, filter } = this.state;
    let filteredData: IProduct[] = [...data];
    if (Number(representation) > 0) {
      filteredData = filteredData.filter(
        (item) => item.representation.id == Number(representation),
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((item) => item.description.includes(filter));
    }

    switch (orderBy) {
      case '1':
        filteredData = filteredData.sort((x, y) => x.id - y.id);
        break;
      case '2':
        filteredData = filteredData.sort((x, y) => y.id - x.id);
        break;
      case '3':
        filteredData = filteredData.sort((x, y) => {
          if (x.description.toUpperCase() > y.description.toUpperCase()) return 1;
          if (x.description.toUpperCase() < y.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (y.description.toUpperCase() > x.description.toUpperCase()) return 1;
          if (y.description.toUpperCase() < x.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.measure.toUpperCase() > y.measure.toUpperCase()) return 1;
          if (x.measure.toUpperCase() < y.measure.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.measure.toUpperCase() > x.measure.toUpperCase()) return 1;
          if (y.measure.toUpperCase() < x.measure.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (x.price > y.price) return 1;
          if (x.price < y.price) return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (y.price > x.price) return 1;
          if (y.price < x.price) return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() >
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return 1;
          if (
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() <
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() >
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return 1;
          if (
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() <
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
    }

    return filteredData;
  };

  handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ filter: e.target.value });
  };

  handleRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ representation: e.target.value });
  };

  handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ orderBy: e.target.value, products: this.filterData(e.target.value) });
  };

  handleFilterClick = () => {
    this.setState({ products: this.filterData(this.state.orderBy) });
  };

  remove = async (id: number) => {
    const { data, products } = this.state;
    const response = confirm('Confirma a exclusão deste produto?');
    if (response) {
      const product = products.find((item) => item.id == id) as Product;
      if (await product.delete()) {
        const newData = [...data];
        newData.splice(
          newData.findIndex((item) => item.id == id),
          1,
        );
        const newProducts = [...products];
        newProducts.splice(
          newProducts.findIndex((item) => item.id == id),
          1,
        );
        this.setState({ data: newData, products: newProducts });
      }
    }
  };

  render() {
    const { products, filter, representation, representations, orderBy } = this.state;

    return (
      <>
        <CardTitle text="Gerenciar Produtos" />
        <FieldsetCard legend="Filtragem de Produtos">
          <Row>
            <FormInputText
              colSm={6}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={filter}
              placeholder="Filtrar por descrição..."
              onChange={(e) => this.handleFilterChange(e)}
            />
            <FormInputSelect
              colSm={4}
              id="representacao"
              label="Representação"
              obrigatory={false}
              value={representation}
              onChange={(e) => this.handleRepresentationChange(e)}
            >
              <option value="0">SELECIONE</option>
              {representations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.person.enterprise?.fantasyName + ' (' + item.unity + ')'}
                </option>
              ))}
            </FormInputSelect>
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={this.handleFilterClick}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Produtos Cadastrados">
          <Row style={{ marginBottom: '10px' }}>
            <FormInputSelect
              colSm={10}
              id="order"
              label="Ordernar por"
              obrigatory={false}
              value={orderBy}
              onChange={(e) => this.handleOrderChange(e)}
            >
              <option value="1">REGISTRO (CRESCENTE)</option>
              <option value="2">REGISTRO (DECRESCENTE)</option>
              <option value="3">DESCRIÇÃO (CRESCENTE)</option>
              <option value="4">DESCRIÇÃO (DECRESCENTE)</option>
              <option value="5">MEDIDA (CRESCENTE)</option>
              <option value="6">MEDIDA (DECRESCENTE)</option>
              <option value="7">PREÇO (CRESCENTE)</option>
              <option value="8">PREÇO (DECRESCENTE)</option>
              <option value="9">REPRESENTAÇÃO (CRESCENTE)</option>
              <option value="10">REPRESENTAÇÃO (DECRESCENTE)</option>
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/produto/novo"
            />
          </Row>
          <Table id="tableProducts" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th hidden>ID</th>
                <th style={{ width: '30%' }}>DESCRIÇÃO</th>
                <th style={{ width: '16%' }}>MEDIDA</th>
                <th style={{ width: '10%' }}>PREÇO</th>
                <th style={{ width: '20%' }}>REPRESENTAÇÂO</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyProducts">
              {products.map((item) => (
                <tr key={item.id}>
                  <td hidden>{item.id}</td>
                  <td>{item.description}</td>
                  <td>{item.measure}</td>
                  <td>{formatarValor(item.price)}</td>
                  <td>{item.representation.person.enterprise?.fantasyName}</td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => {
                        history.push(`/produto/editar/${item.id}`);
                        window.location.reload();
                      }}
                    />
                  </td>
                  <td>
                    <FaTrash
                      role="button"
                      color="red"
                      size={14}
                      title="Excluir"
                      onClick={async () => await this.remove(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </FieldsetCard>
      </>
    );
  }
}
