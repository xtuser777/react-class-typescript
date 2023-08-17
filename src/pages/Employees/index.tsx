import React, { ChangeEvent, Component, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { formatarData } from '../../utils/format';
import { FaEdit, FaPowerOff, FaTrash } from 'react-icons/fa';
import history from '../../services/history';
import { IndividualPerson } from '../../models/IndividualPerson';
import { Employee, IEmployee } from '../../models/Employee';

interface IComponentState {
  data: IEmployee[];
  employees: IEmployee[];
  filter: string;
  admission: string;
  orderBy: string;
}

export class Employees extends Component<unknown, IComponentState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      data: [],
      employees: [],
      filter: '',
      admission: '',
      orderBy: '1',
    };
  }

  getData = async () => {
    const users = await new Employee().get();
    this.setState({
      data: users,
      employees: users,
    });
  };

  async componentDidMount(): Promise<void> {
    await this.getData();
  }

  filterData = (orderBy: string) => {
    const { data, filter, admission } = this.state;
    let filteredData: IEmployee[] = [...data];
    if (admission.length == 10) {
      filteredData = filteredData.filter(
        (item) => item.admission.substring(0, 10) == admission,
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter(
        (item) =>
          item.login.includes(filter) ||
          (item.person.individual as IndividualPerson).name.includes(filter) ||
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
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
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
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.login.toUpperCase() > y.login.toUpperCase()) return 1;
          if (x.login.toUpperCase() < y.login.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.login.toUpperCase() > x.login.toUpperCase()) return 1;
          if (y.login.toUpperCase() < x.login.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => x.level.id - y.level.id);
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => y.level.id - x.level.id);
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
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
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
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
        });
        break;
      case '11':
        filteredData = filteredData.sort((x, y) => {
          if (x.admission > y.admission) return 1;
          if (x.admission < y.admission) return -1;
          return 0;
        });
        break;
      case '12':
        filteredData = filteredData.sort((x, y) => {
          if (y.admission > x.admission) return 1;
          if (y.admission < x.admission) return -1;
          return 0;
        });
        break;
      case '13':
        filteredData = filteredData.sort((x, y) => x.type - y.type);
        break;
      case '14':
        filteredData = filteredData.sort((x, y) => y.type - x.type);
        break;
      case '15':
        filteredData = filteredData.sort((x, y) => {
          if (x.person.contact.email.toUpperCase() > y.person.contact.email.toUpperCase())
            return 1;
          if (x.person.contact.email.toUpperCase() < y.person.contact.email.toUpperCase())
            return -1;
          return 0;
        });
        break;
      case '16':
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

  isLastAdmin = (currentLevel: string) => {
    const admins = this.state.data.filter(
      (item) => item.level.description == 'Administrador',
    );
    if (admins.length == 1 && currentLevel == 'Administrador') return true;
    else return false;
  };

  async excluir(id: number, nivel: string) {
    const { employees, data } = this.state;
    const nivel_atual = nivel;

    if (this.isLastAdmin(nivel_atual) === true) {
      alert('Não é possível excluir o último administrador.');
    } else {
      const response = confirm('Confirma a exclusão deste funcionário?');
      if (response) {
        const user = employees.find((item) => item.id == id) as Employee;
        if (await user.delete()) {
          const newData = [...data];
          newData.splice(
            newData.findIndex((item) => item.id == id),
            1,
          );
          const newEmployees = [...employees];
          newEmployees.splice(
            newEmployees.findIndex((item) => item.id == id),
            1,
          );
          this.setState({ data: newData, employees: newEmployees });
        }
      }
    }
  }

  async desativar(id: number, nivel: string) {
    const { employees, data } = this.state;
    const nivel_atual = nivel;

    if (this.isLastAdmin(nivel_atual) === true) {
      alert('Não é possível excluir o último administrador.');
    } else {
      const response = confirm('Confirma o desligamento deste funcionário?');
      if (response) {
        const user = employees.find((item) => item.id == id) as Employee;
        user.demission = new Date().toISOString().substring(0, 10);
        if (await user.update()) {
          const newData = [...data];
          newData[newData.findIndex((item) => item.id == id)].demission = new Date()
            .toISOString()
            .substring(0, 10);
          const newEmployees = [...employees];
          newEmployees[newEmployees.findIndex((item) => item.id == id)].demission =
            new Date().toISOString().substring(0, 10);
          this.setState({ data: newData, employees: newEmployees });
        }
      }
    }
  }

  async reativar(id: number) {
    const { employees, data } = this.state;
    const response = confirm('Confirma a Reativação deste funcionário?');
    if (response) {
      const user = employees.find((item) => item.id == id) as Employee;
      user.demission = undefined;
      if (await user.update()) {
        const newData = [...data];
        newData[newData.findIndex((item) => item.id == id)].demission = undefined;
        const newEmployees = [...employees];
        newEmployees[newEmployees.findIndex((item) => item.id == id)].demission =
          undefined;
        this.setState({ data: newData, employees: newEmployees });
      }
    }
  }

  alterar(id: number) {
    history.push(`/funcionario/editar/${id}`);
    window.location.reload();
  }

  render(): React.ReactNode {
    return (
      <>
        <CardTitle text="Gerenciar Funcionários" />
        <FieldsetCard legend="Filtragem de Funcionários">
          <Row>
            <FormInputText
              colSm={8}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={this.state.filter}
              placeholder="Filtrar por nome, login e email..."
              onChange={(e) => this.setState({ filter: e.target.value })}
            />
            <FormInputDate
              colSm={2}
              id="adm"
              label="Admissão"
              obrigatory={false}
              value={this.state.admission}
              onChange={(e) => this.setState({ admission: e.target.value })}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={() =>
                this.setState({ employees: this.filterData(this.state.orderBy) })
              }
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Funcionários Cadastrados">
          <Row style={{ marginBottom: '10px' }}>
            <FormInputSelect
              colSm={10}
              id="order"
              label="Ordernar por"
              obrigatory={false}
              value={this.state.orderBy}
              onChange={(e) => {
                this.setState({
                  orderBy: e.target.value,
                  employees: this.filterData(e.target.value),
                });
              }}
            >
              <option value="1">REGISTRO (CRESCENTE)</option>
              <option value="2">REGISTRO (DECRESCENTE)</option>
              <option value="3">NOME (CRESCENTE)</option>
              <option value="4">NOME (DECRESCENTE)</option>
              <option value="5">USUÁRIO (CRESCENTE)</option>
              <option value="6">USUÁRIO (DECRESCENTE)</option>
              <option value="7">NÍVEL (CRESCENTE)</option>
              <option value="8">NÍVEL (DECRESCENTE)</option>
              <option value="9">CPF (CRESCENTE)</option>
              <option value="10">CPF (DECRESCENTE)</option>
              <option value="11">ADMISSÃO (CRESCENTE)</option>
              <option value="12">ADMISSÃO (DECRESCENTE)</option>
              <option value="13">TIPO (CRESCENTE)</option>
              <option value="14">TIPO (DECRESCENTE)</option>
              <option value="15">EMAIL (CRESCENTE)</option>
              <option value="16">EMAIL (DECRESCENTE)</option>
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/funcionario/novo"
            />
          </Row>
          <Table id="tableEmployees" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th hidden>ID</th>
                <th style={{ width: '20%' }}>NOME</th>
                <th style={{ width: '10%' }}>USUÁRIO</th>
                <th style={{ width: '12%' }}>NÍVEL</th>
                <th style={{ width: '12%' }}>CPF</th>
                <th style={{ width: '6%' }}>ADMISSÃO</th>
                <th style={{ width: '8%' }}>TIPO</th>
                <th style={{ width: '6%' }}>ATIVO</th>
                <th>EMAIL</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyEmployees">
              {this.state.employees.map((item) => (
                <tr key={item.id}>
                  <td hidden>{item.id}</td>
                  <td>{(item.person.individual as IndividualPerson).name}</td>
                  <td>{item.login}</td>
                  <td>{item.level.description}</td>
                  <td>{(item.person.individual as IndividualPerson).cpf}</td>
                  <td>{formatarData(item.admission)}</td>
                  <td>{item.type == 1 ? 'Interno' : 'Vendedor'}</td>
                  <td>{item.demission == undefined ? 'Sim' : 'Não'}</td>
                  <td>{item.person.contact.email}</td>
                  <td>
                    <FaPowerOff
                      role="button"
                      color="gray"
                      size={14}
                      title={item.demission == undefined ? 'Desativar' : 'Reativar'}
                      onClick={async () =>
                        item.demission == undefined
                          ? await this.desativar(item.id, item.level.description)
                          : await this.reativar(item.id)
                      }
                    />
                  </td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => this.alterar(item.id)}
                    />
                  </td>
                  <td>
                    <FaTrash
                      role="button"
                      color="red"
                      size={14}
                      title="Excluir"
                      onClick={async () =>
                        await this.excluir(item.id, item.level.description)
                      }
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
