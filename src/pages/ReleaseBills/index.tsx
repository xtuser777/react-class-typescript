import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { BillPay, IBillPay } from '../../models/BillPay';
import { FaTrash } from 'react-icons/fa';
import { formatarData, formatarValor } from '../../utils/format';
import { toast } from 'react-toastify';
import { IndividualPerson } from '../../models/IndividualPerson';

export function ReleaseBills(): JSX.Element {
  const [data, setData] = useState(new Array<IBillPay>());
  const [bills, setBills] = useState(new Array<IBillPay>());

  const [filter, setFilter] = useState('');
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const [dueDateInit, setDueDateInit] = useState('');
  const handleDueDateInit = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDateInit(e.target.value);
  };

  const [dueDateEnd, setDueDateEnd] = useState('');
  const handleDueDateEnd = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDateEnd(e.target.value);
  };

  const [orderBy, setOrderBy] = useState('1');
  const handleOrderByChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setBills(filterData(e.target.value));
  };

  useEffect(() => {
    const getData = async () => {
      const response = (await new BillPay().get()).filter(
        (bill) => bill.comission == false,
      );
      setData(response);
      setBills(response);
    };

    const load = async () => {
      await getData();
    };

    load();
  }, []);

  const filterData = (orderBy: string) => {
    let filteredData: IBillPay[] = [...data];
    if (dueDateInit.length == 10 && dueDateEnd.length == 10) {
      filteredData = filteredData.filter(
        (item) =>
          item.date.substring(0, 10) >= dueDateInit &&
          item.date.substring(0, 10) <= dueDateEnd,
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((item) => item.description.includes(filter));
    }

    switch (orderBy) {
      case '1':
        filteredData = filteredData.sort(
          (a, b) => a.bill - b.bill && a.installment - b.installment,
        );
        break;
      case '2':
        filteredData = filteredData.sort((a, b) => a.bill - b.bill);
        break;
      case '3':
        filteredData = filteredData.sort((a, b) => b.bill - a.bill);
        break;
      case '4':
        filteredData = filteredData.sort((a, b) => {
          if (a.description.toUpperCase() > b.description.toUpperCase()) return 1;
          if (a.description.toUpperCase() < b.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((a, b) => {
          if (b.description.toUpperCase() > a.description.toUpperCase()) return 1;
          if (b.description.toUpperCase() < a.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((a, b) => a.installment - b.installment);
        break;
      case '7':
        filteredData = filteredData.sort((a, b) => b.installment - a.installment);
        break;
      case '8':
        filteredData = filteredData.sort((a, b) => a.category.id - b.category.id);
        break;
      case '9':
        filteredData = filteredData.sort((a, b) => b.category.id - a.category.id);
        break;
      case '10':
        filteredData = filteredData.sort((a, b) => {
          if (a.dueDate.toUpperCase() > b.dueDate.toUpperCase()) return 1;
          if (a.dueDate.toUpperCase() < b.dueDate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '11':
        filteredData = filteredData.sort((a, b) => {
          if (b.dueDate.toUpperCase() > a.dueDate.toUpperCase()) return 1;
          if (b.dueDate.toUpperCase() < a.dueDate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '12':
        filteredData = filteredData.sort((a, b) => {
          if (
            (a.author.person.individual as IndividualPerson).name.toUpperCase() >
            (b.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (b.author.person.individual as IndividualPerson).name.toUpperCase() <
            (a.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '13':
        filteredData = filteredData.sort((a, b) => {
          if (
            (b.author.person.individual as IndividualPerson).name.toUpperCase() >
            (a.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (b.author.person.individual as IndividualPerson).name.toUpperCase() <
            (a.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '14':
        filteredData = filteredData.sort((a, b) => a.amount - b.amount);
        break;
      case '15':
        filteredData = filteredData.sort((a, b) => b.amount - a.amount);
        break;
    }

    return filteredData;
  };

  const handleFilterClick = () => {
    setBills(filterData(orderBy));
  };

  const remove = async (id: number, category: number, situation: number) => {
    if (category == 249 || category == 250)
      toast.error('Não é possível remover uma conta criada por um pedido.');
    else if (situation > 1) toast.error('Não é possível remover uma conta quitada.');
    else {
      const response = confirm('Confirma a exclusão desta conta?');
      if (response) {
        const bill = bills.find((item) => item.id == id) as BillPay;
        if (await bill.delete()) {
          let newData = [...data];
          newData = newData.filter((b) => b.bill != bill.bill);
          setData(newData);
          let newBills = [...bills];
          newBills = newBills.filter((b) => b.bill != bill.bill);
          setBills(newBills);
        }
      }
    }
  };

  return (
    <>
      <CardTitle text="Lançar Despesas" />
      <FieldsetCard legend="Filtragem de Despesas">
        <Row>
          <FormInputText
            colSm={6}
            id="filtro"
            label="Filtro"
            obrigatory={false}
            placeholder="Filtrar por descrição"
            value={filter}
            onChange={handleFilterChange}
          />
          <FormInputDate
            colSm={2}
            id="vencimento-inicio"
            label="Vencimento Início"
            obrigatory={false}
            value={dueDateInit}
            onChange={handleDueDateInit}
          />
          <FormInputDate
            colSm={2}
            id="vencimento-fim"
            label="Vencimento Fim"
            obrigatory={false}
            value={dueDateEnd}
            onChange={handleDueDateEnd}
          />
          <FormButton
            colSm={2}
            color="primary"
            id="filtrar"
            text="FILTRAR"
            onClick={handleFilterClick}
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Despesas lançadas">
        <Row>
          <FormInputSelect
            colSm={10}
            id="ordenar"
            label="Ordenar por"
            obrigatory={false}
            value={orderBy}
            onChange={handleOrderByChange}
          >
            <option value="1">CONTA/PARCELA (CRESCENTE)</option>
            <option value="2">CONTA (CRESCENTE)</option>
            <option value="3">CONTA (DECRESCENTE)</option>
            <option value="4">DESCRIÇÂO (CRESCENTE)</option>
            <option value="5">DESCRIÇÂO (DECRESCENTE)</option>
            <option value="6">PARCELA (CRESCENTE)</option>
            <option value="7">PARCELA (DECRESCENTE)</option>
            <option value="8">CATEGORIA (CRESCENTE)</option>
            <option value="9">CATEGORIA (DECRESCENTE)</option>
            <option value="10">VENCIMENTO (CRESCENTE)</option>
            <option value="11">VENCIMENTO (DECRESCENTE)</option>
            <option value="12">AUTOR (CRESCENTE)</option>
            <option value="13">AUTOR (DECRESCENTE)</option>
            <option value="14">VALOR (CRESCENTE)</option>
            <option value="15">VALOR (DECRESCENTE)</option>
          </FormInputSelect>
          <FormButtonLink
            colSm={2}
            color="success"
            id="lancar"
            text="LANÇAR"
            to="/lancar/despesa"
          />
        </Row>
        <Table id="table-bills" size="sm" striped hover responsive>
          <thead>
            <tr>
              <th hidden>ID</th>
              <th style={{ width: '6%' }}>CONTA</th>
              <th style={{ width: '25%' }}>DESCRIÇÃO</th>
              <th style={{ width: '6%' }}>PARCELA</th>
              <th style={{ width: '14%' }}>CATEGORIA</th>
              <th style={{ width: '8%' }}>VENC.</th>
              <th style={{ width: '12%' }}>AUTOR</th>
              <th>VALOR (R$)</th>
              <th>SITUAÇÃO</th>
              <th style={{ width: '2%' }}>&nbsp;</th>
            </tr>
          </thead>

          <tbody id="tbody-bills">
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td hidden>{bill.id}</td>
                <td>{bill.bill}</td>
                <td>{bill.description}</td>
                <td>{bill.installment}</td>
                <td>{bill.category.description}</td>
                <td>{formatarData(bill.dueDate)}</td>
                <td>{bill.author.person.individual?.name}</td>
                <td>{formatarValor(bill.amount)}</td>
                <td>
                  {bill.situation == 1
                    ? 'PENDENTE'
                    : bill.situation == 2
                    ? 'PAGO PARCIALMENTE'
                    : 'PAGO'}
                </td>
                <td>
                  <FaTrash
                    role="button"
                    color="red"
                    size={14}
                    title="Excluir"
                    onClick={async () =>
                      await remove(bill.id, bill.category.id, bill.situation)
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
