import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButton } from '../../components/form-button';
import { BillPay, IBillPay } from '../../models/BillPay';
import { Employee, IEmployee } from '../../models/Employee';
import { formatarData, formatarValor } from '../../utils/format';
import axios from '../../services/axios';

export function BillsPayReport(): JSX.Element {
  const [data, setData] = useState(new Array<IBillPay>());
  const [bills, setBills] = useState(new Array<IBillPay>());

  const [salesmans, setSalesmans] = useState(new Array<IEmployee>());

  const [filter, setFilter] = useState('');
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const [dateInit, setDateInit] = useState('');
  const handleDateInitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateInit(e.target.value);
  };

  const [dateEnd, setDateEnd] = useState('');
  const handleDateEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);
  };

  const [dueDate, setDueDate] = useState('');
  const handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const [situation, setSituation] = useState('0');
  const handleSituationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSituation(e.target.value);
  };

  const [comission, setComission] = useState('0');
  const handleComissionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComission(e.target.value);
    if (e.target.value == '0' || e.target.value == '2') setSalesman('0');
  };

  const [salesman, setSalesman] = useState('0');
  const handleSalesmanChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalesman(e.target.value);
  };

  const [orderBy, setOrderBy] = useState('1');
  const handleOrderByChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setBills(filterData(e.target.value));
  };

  useEffect(() => {
    const getSalesmans = async () => {
      const response = (await new Employee().get()).filter(
        (employee) => employee.type == 2,
      );
      setSalesmans(response);
    };

    const getData = async () => {
      const response = await new BillPay().get();
      setData(response);
      setBills(response);
    };

    const load = async () => {
      await getSalesmans();
      await getData();
    };

    load();
  }, []);

  const filterData = (orderBy: string) => {
    let filteredData: IBillPay[] = [...data];
    if (dateInit.length == 10 && dateEnd.length == 10) {
      filteredData = filteredData.filter(
        (item) =>
          item.date.substring(0, 10) >= dateInit && item.date.substring(0, 10) <= dateEnd,
      );
    }

    if (dueDate.length == 10) {
      filteredData = filteredData.filter(
        (item) => item.dueDate.substring(0, 10) == dueDate,
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((item) => item.description.includes(filter));
    }

    if (situation != '0') {
      filteredData = filteredData.filter((item) => item.situation == Number(situation));
    }

    if (comission != '0') {
      filteredData = filteredData.filter((item) =>
        comission == '1' ? item.comission : !item.comission,
      );
    }

    if (salesman != '0') {
      filteredData = filteredData.filter((item) => item.salesman?.id == Number(salesman));
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
        filteredData = filteredData.sort((a, b) => a.amount - b.amount);
        break;
      case '9':
        filteredData = filteredData.sort((a, b) => b.amount - a.amount);
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
        filteredData = filteredData.sort((a, b) => a.situation - b.situation);
        break;
      case '13':
        filteredData = filteredData.sort((a, b) => b.situation - a.situation);
        break;
    }

    return filteredData;
  };

  const handleFilterClick = () => {
    setBills(filterData(orderBy));
  };

  const handleEmitClick = async () => {
    const pays: IBillPay[] = [];
    bills.forEach((b) => pays.push((b as BillPay).toAttributes));
    const result = await axios.post(`/report/bills-pay`, {
      bills: pays,
      filters: {
        filter,
        dateInit,
        dateEnd,
        dueDate,
        situation,
        comission,
        salesman,
        orderBy,
      },
    });
    if (result.data) {
      const fileDate = new Date().toISOString().substring(0, 10);
      const time = new Date()
        .toLocaleTimeString('en-US', {
          timeZone: 'America/Sao_Paulo',
        })
        .substring(0, 8);
      const guia = window.open(
        `http://localhost:3001/reports/RelatorioContasPagar${fileDate.replaceAll(
          '-',
          '',
        )}-${time.trim().replaceAll(':', '')}.pdf`,
        '_blank',
      );
    }
  };

  return (
    <>
      <CardTitle text="Contas a Pagar" />
      <FieldsetCard legend="Filtragem de contas">
        <Row>
          <FormInputText
            colSm={4}
            id="filter"
            label="Filtro"
            obrigatory={false}
            placeholder="Filtrar por descrição"
            value={filter}
            onChange={handleFilterChange}
          />
          <FormInputDate
            colSm={2}
            id="lancamento-inicio"
            label="Lançamento início"
            obrigatory={false}
            value={dateInit}
            onChange={handleDateInitChange}
          />
          <FormInputDate
            colSm={2}
            id="lancamento-fim"
            label="Lançamento fim"
            obrigatory={false}
            value={dateEnd}
            onChange={handleDateEndChange}
          />
          <FormInputDate
            colSm={2}
            id="vencimento"
            label="Vencimento"
            obrigatory={false}
            value={dueDate}
            onChange={handleDueDateChange}
          />
          <FormInputSelect
            colSm={2}
            id="situacao"
            label="Situação"
            obrigatory={false}
            value={situation}
            onChange={handleSituationChange}
          >
            <option value="0">SELECIONE</option>
            <option value="1">PENDENTE</option>
            <option value="2">PAGO PARCIALMENTE</option>
            <option value="3">PAGO</option>
          </FormInputSelect>
        </Row>
        <Row>
          <FormInputSelect
            colSm={2}
            id="comissao"
            label="Comissão"
            obrigatory={false}
            value={comission}
            onChange={handleComissionChange}
          >
            <option value="0">SELECIONE</option>
            <option value="1">SIM</option>
            <option value="2">NÃO</option>
          </FormInputSelect>
          <FormInputSelect
            colSm={3}
            id="vendedor"
            label="Vendedor"
            obrigatory={false}
            value={salesman}
            onChange={handleSalesmanChange}
            disable={comission == '0' || comission == '2'}
          >
            <option value="0">SELECIONE</option>
            {salesmans.map((salesman) => (
              <option key={salesman.id} value={salesman.id}>
                {salesman.person.individual?.name}
              </option>
            ))}
          </FormInputSelect>
          <FormInputSelect
            colSm={3}
            id="ordem"
            label="Ordernar por"
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
            <option value="8">VALOR (CRESCENTE)</option>
            <option value="9">VALOR (DECRESCENTE)</option>
            <option value="10">VENCIMENTO (CRESCENTE)</option>
            <option value="11">VENCIMENTO (DECRESCENTE)</option>
            <option value="12">SITUAÇÃO (CRESCENTE)</option>
            <option value="13">SITUAÇÃO (DECRESCENTE)</option>
          </FormInputSelect>
          <FormButton
            colSm={2}
            color="primary"
            id="filtrar"
            text="FILTRAR"
            onClick={handleFilterClick}
          />
          <FormButton
            colSm={2}
            color="info"
            id="emitir"
            text="EMITIR PDF"
            onClick={handleEmitClick}
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Contas lançadas">
        <Table id="table-bills" striped hover responsive size="sm">
          <thead>
            <tr>
              <th hidden>ID</th>
              <th style={{ width: '5%' }}>CONTA</th>
              <th style={{ width: '28%' }}>DESCRIÇÃO</th>
              <th style={{ width: '6%' }}>PARCELA</th>
              <th>VALOR (R$)</th>
              <th>LANÇAMENTO</th>
              <th>VENCIMENTO</th>
              <th>PAGO (R$)</th>
              <th>PAGAMENTO</th>
              <th>SITUAÇÃO</th>
            </tr>
          </thead>

          <tbody id="tbodyContas">
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td hidden>{bill.id}</td>
                <td>{bill.bill}</td>
                <td>{bill.description}</td>
                <td>{bill.installment}</td>
                <td>{formatarValor(bill.amount)}</td>
                <td>{formatarData(bill.date)}</td>
                <td>{formatarData(bill.dueDate)}</td>
                <td>{formatarValor(bill.amountPaid)}</td>
                <td>{bill.paymentDate ? formatarData(bill.paymentDate) : ''}</td>
                <td>
                  {bill.situation == 1
                    ? 'PENDENTE'
                    : bill.situation == 2
                    ? 'PAGO PARCIALMENTE'
                    : 'PAGO'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </FieldsetCard>
    </>
  );
}
