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
import { ITruck, Truck } from '../../models/Truck';

interface IComponentState {
  data: ITruck[];
  trucks: ITruck[];
  filter: string;
  orderBy: string;
}

export class Trucks extends Component<unknown, IComponentState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      data: [],
      trucks: [],
      filter: '',
      orderBy: '1',
    };
  }

  getData = async () => {
    const data = await new Truck().get();
    this.setState({ data, trucks: data });
  };

  async componentDidMount() {
    await this.getData();
  }

  filterData = (orderBy: string) => {
    const { data, filter } = this.state;
    let filteredData: ITruck[] = [...data];
    if (filter.length > 0) {
      filteredData = filteredData.filter(
        (item) => item.brand.includes(filter) || item.model.includes(filter),
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
          if (x.plate.toUpperCase() > y.plate.toUpperCase()) return 1;
          if (x.plate.toUpperCase() < y.plate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (y.plate.toUpperCase() > x.plate.toUpperCase()) return 1;
          if (y.plate.toUpperCase() < x.plate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.brand.toUpperCase() > y.brand.toUpperCase()) return 1;
          if (x.brand.toUpperCase() < y.brand.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.brand.toUpperCase() > x.brand.toUpperCase()) return 1;
          if (y.brand.toUpperCase() < x.brand.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (x.model.toUpperCase() > y.model.toUpperCase()) return 1;
          if (x.model.toUpperCase() < y.model.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (y.model.toUpperCase() > x.model.toUpperCase()) return 1;
          if (y.model.toUpperCase() < x.model.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (x.color.toUpperCase() > y.color.toUpperCase()) return 1;
          if (x.color.toUpperCase() < y.color.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (y.color.toUpperCase() > x.color.toUpperCase()) return 1;
          if (y.color.toUpperCase() < x.color.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '11':
        filteredData = filteredData.sort((x, y) => x.modelYear - y.modelYear);
        break;
      case '12':
        filteredData = filteredData.sort((x, y) => y.modelYear - x.modelYear);
        break;
    }

    return filteredData;
  };

  remove = async (id: number) => {
    const { data, trucks } = this.state;
    const response = confirm('Confirma o exclusão deste caminhão?');
    if (response) {
      const truck = trucks.find((item) => item.id == id) as Truck;
      if (await truck.delete()) {
        const newData = [...data];
        newData.splice(
          newData.findIndex((item) => item.id == id),
          1,
        );
        const newTrucks = [...trucks];
        newTrucks.splice(
          newTrucks.findIndex((item) => item.id == id),
          1,
        );
        this.setState({ data: newData, trucks: newTrucks });
      }
    }
  };

  render() {
    const { trucks, filter, orderBy } = this.state;

    return (
      <>
        <CardTitle text="Gerenciar Caminhões" />
        <FieldsetCard legend="Filtragem de Caminhões">
          <Row>
            <FormInputText
              colSm={10}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={filter}
              placeholder="Filtrar por marca ou modelo..."
              onChange={(e) => this.setState({ filter: e.target.value })}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={() => this.setState({ trucks: this.filterData(orderBy) })}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Caminhões Cadastrados">
          <Row style={{ marginBottom: '10px' }}>
            <FormInputSelect
              colSm={10}
              id="order"
              label="Ordernar por"
              obrigatory={false}
              value={orderBy}
              onChange={(e) => {
                this.setState({
                  orderBy: e.target.value,
                  trucks: this.filterData(e.target.value),
                });
              }}
            >
              <option value="1">REGISTRO (CRESCENTE)</option>
              <option value="2">REGISTRO (DECRESCENTE)</option>
              <option value="3">PLACA (CRESCENTE)</option>
              <option value="4">PLACA (DECRESCENTE)</option>
              <option value="5">MARCA (CRESCENTE)</option>
              <option value="6">MARCA (DECRESCENTE)</option>
              <option value="7">MODELO (CRESCENTE)</option>
              <option value="8">MODELO (DECRESCENTE)</option>
              <option value="9">ANO (CRESCENTE)</option>
              <option value="10">ANO (DECRESCENTE)</option>
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/caminhao/novo"
            />
          </Row>
          <Table id="tableTrucks" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th className="hidden">ID</th>
                <th style={{ width: '10%' }}>PLACA</th>
                <th style={{ width: '20%' }}>MARCA</th>
                <th style={{ width: '40%' }}>MODELO</th>
                <th style={{ width: '20%' }}>COR</th>
                <th style={{ width: '8%' }}>ANO</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyTrucks">
              {trucks.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.plate}</td>
                  <td>{item.brand}</td>
                  <td>{item.model}</td>
                  <td>{item.color}</td>
                  <td>{item.modelYear}</td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => {
                        history.push(`/caminhao/editar/${item.id}`);
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
