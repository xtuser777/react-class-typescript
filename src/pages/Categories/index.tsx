import React, { ChangeEvent, Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { BillPayCategory, IBillPayCategory } from '../../models/BillPayCategory';
import { FaEdit, FaTrash } from 'react-icons/fa';
import history from '../../services/history';

interface IComponentState {
  data: IBillPayCategory[];
  categories: IBillPayCategory[];
  filter: string;
  orderBy: string;
}

export class Categories extends Component<unknown, IComponentState> {
  constructor(props: unknown) {
    super(props);

    this.state = { data: [], categories: [], filter: '', orderBy: '0' };
  }

  getData = async () => {
    const data = await new BillPayCategory().get();
    this.setState({ data, categories: data });
  };

  filterData = (orderBy: string) => {
    const { data, filter } = this.state;
    let filteredData: IBillPayCategory[] = [...data];

    if (filter.length > 0) {
      filteredData = filteredData.filter((item) =>
        item.description.toUpperCase().includes(filter.toUpperCase()),
      );
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
    }

    return filteredData;
  };

  handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ filter: e.target.value });
  };

  handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      orderBy: e.target.value,
      categories: this.filterData(e.target.value),
    });
  };

  handleFilterClick = () => {
    this.setState({ categories: this.filterData(this.state.orderBy) });
  };

  remove = async (id: number) => {
    const { data, categories } = this.state;
    const response = confirm('Confirma a exclusão desta categoria?');
    if (response) {
      const category = categories.find((item) => item.id == id) as BillPayCategory;
      if (await category.delete()) {
        const newData = [...data];
        newData.splice(
          newData.findIndex((item) => item.id == id),
          1,
        );
        const newCategories = [...categories];
        newCategories.splice(
          newCategories.findIndex((item) => item.id == id),
          1,
        );
      }
    }
  };

  render() {
    const { categories, filter, orderBy } = this.state;

    return (
      <>
        <CardTitle text="Gerenciar Categorias de Contas" />
        <FieldsetCard legend="Filtragem de Categorias de Contas">
          <Row>
            <FormInputText
              colSm={10}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={filter}
              placeholder="Filtrar por descrição..."
              onChange={(e) => this.handleFilterChange(e)}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={this.handleFilterClick}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Categorias de Contas Cadastrados">
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
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/categoria/novo"
            />
          </Row>
          <Table id="tableCategories" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th className="hidden">ID</th>
                <th>DESCRIÇÃO</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyCategories">
              {categories.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => {
                        history.push(`/categoria/editar/${item.id}`);
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
