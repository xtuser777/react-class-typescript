import React, { Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { formatarData, formatarValor } from '../../utils/format';
import { FaEdit, FaTrash } from 'react-icons/fa';
import history from '../../services/history';
import { ISalesBudgetsState } from './types';
import { SalesBudgetsFunctions } from './functions';
import { SalesBudgetsHandles } from './handles';

export class SalesBudgetsComponent extends Component<unknown, ISalesBudgetsState> {
  private functions: SalesBudgetsFunctions;
  private handles: SalesBudgetsHandles;

  constructor(props: unknown) {
    super(props);

    this.functions = new SalesBudgetsFunctions(this);
    this.handles = new SalesBudgetsHandles(this, this.functions);

    this.state = {
      data: [],
      budgets: [],
      filter: '',
      date: '',
      orderBy: '1',
    };
  }

  async componentDidMount() {
    await this.functions.getData();
  }

  render() {
    const { budgets, filter, date, orderBy } = this.state;

    return (
      <>
        <CardTitle text="Gerenciar Orçamentos de Venda" />
        <FieldsetCard legend="Filtragem de Orçamentos">
          <Row>
            <FormInputText
              colSm={8}
              id="filtro"
              label="Filtro"
              obrigatory={false}
              value={filter}
              placeholder="Filtrar por descrição e cliente..."
              onChange={(e) => this.handles.handleFilterChange(e)}
            />
            <FormInputDate
              colSm={2}
              id="data"
              label="Data"
              obrigatory={false}
              value={date}
              onChange={(e) => this.handles.handleDateChange(e)}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="filtrar"
              text="FILTRAR"
              onClick={this.handles.handleFilterClick}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Orçamentos Cadastrados">
          <Row style={{ marginBottom: '10px' }}>
            <FormInputSelect
              colSm={10}
              id="order"
              label="Ordernar por"
              obrigatory={false}
              value={orderBy}
              onChange={(e) => this.handles.handleOrderChange(e)}
            >
              <option value="1">REGISTRO (CRESCENTE)</option>
              <option value="2">REGISTRO (DECRESCENTE)</option>
              <option value="3">DESCRIÇÂO (CRESCENTE)</option>
              <option value="4">DESCRIÇÂO (DECRESCENTE)</option>
              <option value="5">CLIENTE (CRESCENTE)</option>
              <option value="6">CLIENTE (DECRESCENTE)</option>
              <option value="7">DATA (CRESCENTE)</option>
              <option value="8">DATA (DECRESCENTE)</option>
              <option value="9">AUTOR (CRESCENTE)</option>
              <option value="10">AUTOR (DECRESCENTE)</option>
              <option value="11">VALOR (CRESCENTE)</option>
              <option value="12">VALOR (DECRESCENTE)</option>
            </FormInputSelect>
            <FormButtonLink
              colSm={2}
              color="success"
              id="novo"
              text="NOVO"
              to="/orcamento/venda/novo"
            />
          </Row>
          <Table id="tableBudgets" size="sm" striped hover responsive>
            <thead>
              <tr>
                <th className="hidden">ID</th>
                <th>DESCRIÇÃO</th>
                <th>CLIENTE</th>
                <th>DATA</th>
                <th>AUTOR</th>
                <th>VALOR (R$)</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
                <th style={{ width: '2%' }}>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyBudgets">
              {budgets.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>{item.clientName}</td>
                  <td>{formatarData(item.date)}</td>
                  <td>{item.author.person.individual?.name}</td>
                  <td>{formatarValor(item.value)}</td>
                  <td>
                    <FaEdit
                      role="button"
                      color="blue"
                      size={14}
                      title="Editar"
                      onClick={() => {
                        history.push(`/orcamento/venda/editar/${item.id}`);
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
                      onClick={async () => await this.functions.remove(item.id)}
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
