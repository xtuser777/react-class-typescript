import React, { Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import history from '../../services/history';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ITruckType, TruckType } from '../../models/TruckType';
import { formatarPeso } from '../../utils/format';

interface IComponentState {
  data: ITruckType[];
  types: ITruckType[];
  filter: string;
  orderBy: string;
}

export class TruckTypes extends Component<unknown, IComponentState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      data: [],
      types: [],
      filter: '',
      orderBy: '1',
    };
  }

  getData = async () => {
    const data = await new TruckType().get();
    this.setState({ data, types: data });
  };

  async componentDidMount() {
    await this.getData();
  }

  filterData = (orderBy: string) => {
    const { data, filter } = this.state;
    let filteredData: ITruckType[] = [...data];
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
      case '5':
        filteredData = filteredData.sort((x, y) => x.axes - y.axes);
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => y.axes - x.axes);
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => x.capacity - y.capacity);
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => y.capacity - x.capacity);
        break;
    }

    return filteredData;
  };

  remove = async (id: number) => {
    const { data, types } = this.state;
    const response = confirm('Confirma o exclusão deste tipo de caminhão?');
    if (response) {
      const type = types.find((item) => item.id == id) as TruckType;
      if (await type.delete()) {
        const newData = [...data];
        newData.splice(
          newData.findIndex((item) => item.id == id),
          1,
        );
        const newTypes = [...types];
        newTypes.splice(
          newTypes.findIndex((item) => item.id == id),
          1,
        );
        this.setState({ data: newData, types: newTypes });
      }
    }
  };

  render() {
    const { types, filter, orderBy } = this.state;
    return (
      <>
        <CardTitle text="Gerenciar Tipos de Caminhão" />
        <FieldsetCard legend="Filtragem de Tipos de Caminhão">
          <Row>
            <FormInputText
              colSm={10}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={filter}
              placeholder="Filtrar por descrição..."
              onChange={(e) => this.setState({ filter: e.target.value })}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={() => this.setState({ types: this.filterData(orderBy) })}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Tipos de Caminhão Cadastrados">
          <Row style={{ marginBottom: '10px' }}>
            <FormInputSelect
              colSm={10}
              id="order"
              label="Ordernar por"
              obrigatory={false}
              value={orderBy}
              onChange={(e) => {
                this.setState({
                  filter: e.target.value,
                  types: this.filterData(e.target.value),
                });
              }}
            >
              <option value="1">REGISTRO (CRESCENTE)</option>
              <option value="2">REGISTRO (DECRESCENTE)</option>
              <option value="3">DESCRIÇÃO (CRESCENTE)</option>
              <option value="4">DESCRIÇÃO (DECRESCENTE)</option>
              <option value="5">EIXOS (CRESCENTE)</option>
              <option value="6">EIXOS (DECRESCENTE)</option>
              <option value="7">CAPACIDADE (CRESCENTE)</option>
              <option value="8">CAPACIDADE (DECRESCENTE)</option>
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/tipocaminhao/novo"
            />
          </Row>
          <Table id="tableTruckType" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th hidden>ID</th>
                <th style={{ width: '40%' }}>DESCRIÇÃO</th>
                <th style={{ width: '16%' }}>EIXOS</th>
                <th style={{ width: '10%' }}>CAPACIDADE</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyTruckType">
              {types.map((item) => (
                <tr key={item.id}>
                  <td hidden>{item.id}</td>
                  <td>{item.description}</td>
                  <td>{item.axes}</td>
                  <td>{formatarPeso(item.capacity)}</td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => {
                        history.push(`/tipocaminhao/editar/${item.id}`);
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
