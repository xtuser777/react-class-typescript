import React, { Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { IRepresentation, Representation } from '../../models/Representation';
import { formatarData } from '../../utils/format';
import { FaEdit, FaTrash } from 'react-icons/fa';
import history from '../../services/history';
import { MdAdd } from 'react-icons/md';
import { EnterprisePerson } from '../../models/EnterprisePerson';

interface IComponentState {
  data: IRepresentation[];
  representations: IRepresentation[];
  filter: string;
  register: string;
  orderBy: string;
}

export class Representations extends Component<unknown, IComponentState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      data: [],
      representations: [],
      filter: '',
      register: '',
      orderBy: '1',
    };
  }

  getData = async () => {
    const data = await new Representation().get();
    this.setState({ data, representations: data });
  };

  async componentDidMount() {
    await this.getData();
  }

  filterData = (orderBy: string) => {
    const { data, filter, register } = this.state;
    let filteredData: IRepresentation[] = [...data];
    if (register.length == 10) {
      filteredData = filteredData.filter(
        (item) => item.register.substring(0, 10) == register,
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter(
        (item) =>
          (item.person.enterprise as EnterprisePerson).fantasyName.includes(filter) ||
          item.unity.includes(filter) ||
          item.person.contact.email.includes(filter),
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
          if (
            (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() >
            (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
          )
            return 1;
          if (
            (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() <
            (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (
            (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() >
            (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
          )
            return 1;
          if (
            (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() <
            (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (
            (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase() >
            (y.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
          )
            return 1;
          if (
            (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase() <
            (y.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (
            (y.person.enterprise as EnterprisePerson).cnpj.toUpperCase() >
            (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
          )
            return 1;
          if (
            (y.person.enterprise as EnterprisePerson).cnpj.toUpperCase() <
            (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (x.register > y.register) return 1;
          if (x.register < y.register) return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (y.register > x.register) return 1;
          if (y.register < x.register) return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (x.unity.toUpperCase() > y.unity.toUpperCase()) return 1;
          if (x.unity.toUpperCase() < y.unity.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (y.unity.toUpperCase() > x.unity.toUpperCase()) return 1;
          if (y.unity.toUpperCase() < x.unity.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '11':
        filteredData = filteredData.sort((x, y) => {
          if (x.person.contact.email.toUpperCase() > y.person.contact.email.toUpperCase())
            return 1;
          if (x.person.contact.email.toUpperCase() < y.person.contact.email.toUpperCase())
            return -1;
          return 0;
        });
        break;
      case '12':
        filteredData = filteredData.sort((x, y) => {
          if (y.person.contact.email.toUpperCase() > x.person.contact.email.toUpperCase())
            return 1;
          if (y.person.contact.email.toUpperCase() < x.person.contact.email.toUpperCase())
            return -1;
          return 0;
        });
        break;
    }

    return filteredData;
  };

  remove = async (id: number) => {
    const { data, representations } = this.state;
    const response = confirm('Confirma a exclusão desta representação?');
    if (response) {
      const representation = representations.find(
        (item) => item.id == id,
      ) as Representation;
      if (await representation.delete()) {
        const newData = [...data];
        newData.splice(
          newData.findIndex((item) => item.id == id),
          1,
        );
        const newRepresentations = [...representations];
        newRepresentations.splice(
          newRepresentations.findIndex((item) => item.id == id),
          1,
        );
        this.setState({ data: newData, representations: newRepresentations });
      }
    }
  };

  render() {
    const { representations, filter, register, orderBy } = this.state;
    return (
      <>
        <CardTitle text="Gerenciar Representações" />
        <FieldsetCard legend="Filtragem de Representações">
          <Row>
            <FormInputText
              colSm={8}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={filter}
              placeholder="Filtrar por nome fantasia, unidade e email..."
              onChange={(e) => {
                this.setState({ filter: e.target.value });
              }}
            />
            <FormInputDate
              colSm={2}
              id="cad"
              label="Cadastro"
              obrigatory={false}
              value={register}
              onChange={(e) => {
                this.setState({ register: e.target.value });
              }}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={() => this.setState({ representations: this.filterData(orderBy) })}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Representações Cadastradas">
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
                  representations: this.filterData(e.target.value),
                });
              }}
            >
              <option value="1">REGISTRO (CRESCENTE)</option>
              <option value="2">REGISTRO (DECRESCENTE)</option>
              <option value="3">NOME FANTASIA (CRESCENTE)</option>
              <option value="4">NOME FANTASIA (DECRESCENTE)</option>
              <option value="5">CNPJ (CRESCENTE)</option>
              <option value="6">CNPJ (DECRESCENTE)</option>
              <option value="7">CADASTRO (CRESCENTE)</option>
              <option value="8">CADASTRO (DECRESCENTE)</option>
              <option value="9">UNIDADE (CRESCENTE)</option>
              <option value="10">UNIDADE (DECRESCENTE)</option>
              <option value="11">EMAIL (CRESCENTE)</option>
              <option value="12">EMAIL (DECRESCENTE)</option>
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/representacao/novo"
            />
          </Row>
          <Table id="tableRepresentations" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th className="hidden">ID</th>
                <th style={{ width: '30%' }}>NOME FANTASIA</th>
                <th style={{ width: '16%' }}>CNPJ</th>
                <th style={{ width: '10%' }}>CADASTRO</th>
                <th style={{ width: '20%' }}>UNIDADE</th>
                <th>EMAIL</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyRepresentations">
              {representations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.person.enterprise?.fantasyName}</td>
                  <td>{item.person.enterprise?.cnpj}</td>
                  <td>{formatarData(item.register)}</td>
                  <td>{item.unity}</td>
                  <td>{item.person.contact.email}</td>
                  <td>
                    <MdAdd
                      role="button"
                      color="green"
                      size={14}
                      title="Adicionar Unidade"
                      onClick={() => {
                        history.push(`/representacao/unidade/${item.id}`);
                        window.location.reload();
                      }}
                    />
                  </td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => {
                        history.push(`/representacao/editar/${item.id}`);
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
