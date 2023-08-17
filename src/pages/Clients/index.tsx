import React, { Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { Client, IClient } from '../../models/Client';
import { IndividualPerson } from '../../models/IndividualPerson';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { FaEdit, FaTrash } from 'react-icons/fa';
import history from '../../services/history';
import { formatarData } from '../../utils/format';

interface IComponentState {
  data: IClient[];
  clients: IClient[];
  filter: string;
  register: string;
  orderBy: string;
}

export class Clients extends Component<unknown, IComponentState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      data: [],
      clients: [],
      filter: '',
      register: '',
      orderBy: '1',
    };
  }

  getData = async () => {
    const data = await new Client().get();
    this.setState({
      data,
      clients: data,
    });
  };

  async componentDidMount(): Promise<void> {
    await this.getData();
  }

  filterData = (orderBy: string) => {
    const { data, filter, register } = this.state;
    let filteredData: IClient[] = [...data];
    if (register.length == 10) {
      filteredData = filteredData.filter(
        (item) => item.register.substring(0, 10) == register,
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((item) =>
        item.person.type == 1
          ? (item.person.individual as IndividualPerson).name.includes(filter) ||
            item.person.contact.email.includes(filter)
          : (item.person.enterprise as EnterprisePerson).fantasyName.includes(filter) ||
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
          if (x.person.type == 1) {
            if (y.person.type == 1) {
              if (
                (x.person.individual as IndividualPerson).name.toUpperCase() >
                (y.person.individual as IndividualPerson).name.toUpperCase()
              )
                return 1;
              if (
                (x.person.individual as IndividualPerson).name.toUpperCase() <
                (y.person.individual as IndividualPerson).name.toUpperCase()
              )
                return -1;
              return 0;
            } else {
              if (
                (x.person.individual as IndividualPerson).name.toUpperCase() >
                (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
              )
                return 1;
              if (
                (x.person.individual as IndividualPerson).name.toUpperCase() <
                (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
              )
                return -1;
              return 0;
            }
          } else {
            if (y.person.type == 1) {
              if (
                (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() >
                (y.person.individual as IndividualPerson).name.toUpperCase()
              )
                return 1;
              if (
                (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() <
                (y.person.individual as IndividualPerson).name.toUpperCase()
              )
                return -1;
              return 0;
            } else {
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
            }
          }
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (y.person.type == 1) {
            if (x.person.type == 1) {
              if (
                (y.person.individual as IndividualPerson).name.toUpperCase() >
                (x.person.individual as IndividualPerson).name.toUpperCase()
              )
                return 1;
              if (
                (y.person.individual as IndividualPerson).name.toUpperCase() <
                (x.person.individual as IndividualPerson).name.toUpperCase()
              )
                return -1;
              return 0;
            } else {
              if (
                (y.person.individual as IndividualPerson).name.toUpperCase() >
                (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
              )
                return 1;
              if (
                (y.person.individual as IndividualPerson).name.toUpperCase() <
                (x.person.enterprise as EnterprisePerson).fantasyName.toUpperCase()
              )
                return -1;
              return 0;
            }
          } else {
            if (x.person.type == 1) {
              if (
                (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() >
                (x.person.individual as IndividualPerson).name.toUpperCase()
              )
                return 1;
              if (
                (y.person.enterprise as EnterprisePerson).fantasyName.toUpperCase() <
                (x.person.individual as IndividualPerson).name.toUpperCase()
              )
                return -1;
              return 0;
            } else {
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
            }
          }
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.person.type == 1) {
            if (y.person.type == 1) {
              if (
                (x.person.individual as IndividualPerson).cpf.toUpperCase() >
                (y.person.individual as IndividualPerson).cpf.toUpperCase()
              )
                return 1;
              if (
                (x.person.individual as IndividualPerson).cpf.toUpperCase() <
                (y.person.individual as IndividualPerson).cpf.toUpperCase()
              )
                return -1;
              return 0;
            } else {
              if (
                (x.person.individual as IndividualPerson).cpf.toUpperCase() >
                (y.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
              )
                return 1;
              if (
                (x.person.individual as IndividualPerson).cpf.toUpperCase() <
                (y.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
              )
                return -1;
              return 0;
            }
          } else {
            if (y.person.type == 1) {
              if (
                (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase() >
                (y.person.individual as IndividualPerson).cpf.toUpperCase()
              )
                return 1;
              if (
                (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase() <
                (y.person.individual as IndividualPerson).cpf.toUpperCase()
              )
                return -1;
              return 0;
            } else {
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
            }
          }
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.person.type == 1) {
            if (x.person.type == 1) {
              if (
                (y.person.individual as IndividualPerson).cpf.toUpperCase() >
                (x.person.individual as IndividualPerson).cpf.toUpperCase()
              )
                return 1;
              if (
                (y.person.individual as IndividualPerson).cpf.toUpperCase() <
                (x.person.individual as IndividualPerson).cpf.toUpperCase()
              )
                return -1;
              return 0;
            } else {
              if (
                (y.person.individual as IndividualPerson).cpf.toUpperCase() >
                (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
              )
                return 1;
              if (
                (y.person.individual as IndividualPerson).cpf.toUpperCase() <
                (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
              )
                return -1;
              return 0;
            }
          } else {
            if (y.person.type == 1) {
              if (
                (y.person.individual as IndividualPerson).cpf.toUpperCase() >
                (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
              )
                return 1;
              if (
                (y.person.individual as IndividualPerson).cpf.toUpperCase() <
                (x.person.enterprise as EnterprisePerson).cnpj.toUpperCase()
              )
                return -1;
              return 0;
            } else {
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
            }
          }
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
        filteredData = filteredData.sort((x, y) => x.person.type - y.person.type);
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => y.person.type - x.person.type);
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
    const response = confirm('Confirma o exclusão deste cliente?');
    if (response) {
      const client = this.state.clients.find((item) => item.id == id) as Client;
      if (await client.delete()) {
        const newData = [...this.state.data];
        newData.splice(
          newData.findIndex((item) => item.id == id),
          1,
        );
        const newClients = [...this.state.clients];
        newClients.splice(
          newClients.findIndex((item) => item.id == id),
          1,
        );
        this.setState({
          data: newData,
          clients: newClients,
        });
      }
    }
  };

  render(): React.ReactNode {
    return (
      <>
        <CardTitle text="Gerenciar Clientes" />
        <FieldsetCard legend="Filtragem de Clientes">
          <Row>
            <FormInputText
              colSm={8}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={this.state.filter}
              placeholder="Filtrar por nome e email..."
              onChange={(e) => {
                this.setState({ filter: e.target.value });
              }}
            />
            <FormInputDate
              colSm={2}
              id="cad"
              label="Cadastro"
              obrigatory={false}
              value={this.state.register}
              onChange={(e) => {
                this.setState({ register: e.target.value });
              }}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={() => {
                this.setState({ clients: this.filterData(this.state.orderBy) });
              }}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Clientes Cadastrados">
          <Row style={{ marginBottom: '10px' }}>
            <FormInputSelect
              colSm={10}
              id="order"
              label="Ordernar por"
              obrigatory={false}
              value={this.state.orderBy}
              onChange={(e) => {
                this.setState({ orderBy: e.target.value });
                this.setState({ clients: this.filterData(e.target.value) });
              }}
            >
              <option value="1">REGISTRO (CRESCENTE)</option>
              <option value="2">REGISTRO (DECRESCENTE)</option>
              <option value="3">NOME (CRESCENTE)</option>
              <option value="4">NOME (DECRESCENTE)</option>
              <option value="5">CPF/CNPJ (CRESCENTE)</option>
              <option value="6">CPF/CNPJ (DECRESCENTE)</option>
              <option value="7">CADASTRO (CRESCENTE)</option>
              <option value="8">CADASTRO (DECRESCENTE)</option>
              <option value="9">TIPO (CRESCENTE)</option>
              <option value="10">TIPO (DECRESCENTE)</option>
              <option value="11">EMAIL (CRESCENTE)</option>
              <option value="12">EMAIL (DECRESCENTE)</option>
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/cliente/novo"
            />
          </Row>
          <Table id="tableClients" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th hidden>ID</th>
                <th style={{ width: '40%' }}>NOME/NOME FANTASIA</th>
                <th style={{ width: '14%' }}>CPF/CNPJ</th>
                <th style={{ width: '10%' }}>CADASTRO</th>
                <th style={{ width: '6%' }}>TIPO</th>
                <th>EMAIL</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyClients">
              {this.state.clients.map((item) => (
                <tr key={item.id}>
                  <td hidden>{item.id}</td>
                  <td>
                    {item.person.type == 1
                      ? (item.person.individual as IndividualPerson).name
                      : (item.person.enterprise as EnterprisePerson).fantasyName}
                  </td>
                  <td>
                    {item.person.type == 1
                      ? (item.person.individual as IndividualPerson).cpf
                      : (item.person.enterprise as EnterprisePerson).cnpj}
                  </td>
                  <td>{formatarData(item.register)}</td>
                  <td>{item.person.type == 1 ? 'Física' : 'Juridica'}</td>
                  <td>
                    {item.person.type == 1
                      ? item.person.contact.email
                      : item.person.contact.email}
                  </td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => {
                        history.push(`/cliente/editar/${item.id}`);
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
