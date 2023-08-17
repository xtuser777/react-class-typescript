import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Col, Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButton } from '../../components/form-button';
import { IReceiveBill, ReceiveBill } from '../../models/ReceiveBill';
import { formatarData, formatarValor } from '../../utils/format';
import { FaEdit, FaUndo } from 'react-icons/fa';
import history from '../../services/history';
import { toast } from 'react-toastify';
import { IRepresentation, Representation } from '../../models/Representation';
import { ReceiveBill as ReceiveBillModel } from '../../models/ReceiveBill';

export function ReceiveBills(): JSX.Element {
  const [data, setData] = useState(new Array<IReceiveBill>());
  const [bills, setBills] = useState(new Array<IReceiveBill>());

  const [representations, setRepresentations] = useState(new Array<IRepresentation>());

  const [filter, setFilter] = useState('');
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const getSalesmans = async () => {
      const response = await new Representation().get();
      setRepresentations(response);
    };

    const getData = async () => {
      const response = await new ReceiveBillModel().get();
      setData(response);
      setBills(response);
    };

    const load = async () => {
      await getSalesmans();
      await getData();
    };

    load();
  }, []);

  const [dueDateInit, setDueDateInit] = useState('');
  const handleDueDateInitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDateInit(e.target.value);
  };

  const [dueDateEnd, setDueDateEnd] = useState('');
  const handleDueDateEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDateEnd(e.target.value);
  };

  const [situation, setSituation] = useState('0');
  const handleSituationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSituation(e.target.value);
  };

  const [comission, setComission] = useState('0');
  const handleComissionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComission(e.target.value);
    if (e.target.value == '0' || e.target.value == '2') setRepresentation('0');
  };

  const [representation, setRepresentation] = useState('0');
  const handleRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRepresentation(e.target.value);
  };

  const [orderBy, setOrderBy] = useState('1');
  const handleOrderByChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setBills(filterData(e.target.value));
  };

  const filterData = (orderBy: string) => {
    let filteredData: IReceiveBill[] = [...data];
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

    if (situation != '0') {
      filteredData = filteredData.filter((item) => item.situation == Number(situation));
    }

    if (comission != '0') {
      filteredData = filteredData.filter((item) =>
        comission == '1' ? item.comission : !item.comission,
      );
    }

    if (representation != '0') {
      filteredData = filteredData.filter(
        (item) => item.representation?.id == Number(representation),
      );
    }

    switch (orderBy) {
      case '1':
        filteredData = filteredData.sort((a, b) => a.bill - b.bill);
        break;
      case '2':
        filteredData = filteredData.sort((a, b) => b.bill - a.bill);
        break;
      case '3':
        filteredData = filteredData.sort((a, b) => {
          if (a.description.toUpperCase() > b.description.toUpperCase()) return 1;
          if (a.description.toUpperCase() < b.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((a, b) => {
          if (b.description.toUpperCase() > a.description.toUpperCase()) return 1;
          if (b.description.toUpperCase() < a.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((a, b) => a.amount - b.amount);
        break;
      case '6':
        filteredData = filteredData.sort((a, b) => b.amount - a.amount);
        break;
      case '7':
        filteredData = filteredData.sort((a, b) => {
          if (a.dueDate.toUpperCase() > b.dueDate.toUpperCase()) return 1;
          if (a.dueDate.toUpperCase() < b.dueDate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((a, b) => {
          if (b.dueDate.toUpperCase() > a.dueDate.toUpperCase()) return 1;
          if (b.dueDate.toUpperCase() < a.dueDate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((a, b) => a.situation - b.situation);
        break;
      case '10':
        filteredData = filteredData.sort((a, b) => b.situation - a.situation);
        break;
    }

    return filteredData;
  };

  const handleFilterClick = () => {
    setBills(filterData(orderBy));
  };

  const reversal = async (id: number, situation: number) => {
    if (situation == 1) {
      toast.error('Não é possível estornar uma conta não recebida.');
    } else {
      const response = confirm('Confirma o estorno desta conta?');
      if (response) {
        const bill = bills.find((item) => item.id == id) as ReceiveBill;
        const receiveDate = bill.receiveDate;
        const amountReceived = bill.amountReceived;
        const situation = bill.situation;
        const paymentForm = bill.paymentForm;
        bill.receiveDate = undefined;
        bill.amountReceived = 0.0;
        bill.situation = 1;
        bill.paymentForm = undefined;
        if (await bill.update()) {
          let newData = [...data];
          const d = newData.find((item) => item.id == id) as ReceiveBill;
          d.receiveDate = undefined;
          d.amountReceived = 0.0;
          d.situation = 1;
          d.paymentForm = undefined;
          if (d.pendency) {
            newData = newData.filter((bill) => bill.id != d.pendency?.id);
          }
          setData(newData);
          let newBills = [...bills];
          if (bill.pendency) {
            newBills = newBills.filter((b) => b.id != bill.pendency?.id);
          }
          bill.pendency = undefined;
          setBills(newBills);
        } else {
          bill.receiveDate = receiveDate;
          bill.amountReceived = amountReceived;
          bill.situation = situation;
          bill.paymentForm = paymentForm;
        }
      }
    }
  };

  return (
    <>
      <CardTitle text="Contas a Receber" />
      <FieldsetCard legend="Filtragem de contas">
        <Row>
          <FormInputText
            colSm={5}
            id="filter"
            label="Filtro"
            obrigatory={false}
            placeholder="Filtrar por descrição"
            value={filter}
            onChange={handleFilterChange}
          />
          <FormInputDate
            colSm={2}
            id="vencimento-inicio"
            label="Vencimento início"
            obrigatory={false}
            value={dueDateInit}
            onChange={handleDueDateInitChange}
          />
          <FormInputDate
            colSm={2}
            id="vencimento-fim"
            label="Vencimento fim"
            obrigatory={false}
            value={dueDateEnd}
            onChange={handleDueDateEndChange}
          />
          <FormInputSelect
            colSm={3}
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
            colSm={4}
            id="representacao"
            label="Representação"
            obrigatory={false}
            value={representation}
            onChange={handleRepresentationChange}
            disable={comission == '0' || comission == '2'}
          >
            <option value="0">SELECIONE</option>
            {representations.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.person.enterprise?.fantasyName + ' (' + rep.unity + ')'}
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
            <option value="1">CONTA (CRESCENTE)</option>
            <option value="2">CONTA (DECRESCENTE)</option>
            <option value="3">DESCRIÇÂO (CRESCENTE)</option>
            <option value="4">DESCRIÇÂO (DECRESCENTE)</option>
            <option value="5">VALOR (CRESCENTE)</option>
            <option value="6">VALOR (DECRESCENTE)</option>
            <option value="7">VENCIMENTO (CRESCENTE)</option>
            <option value="8">VENCIMENTO (DECRESCENTE)</option>
            <option value="9">SITUAÇÃO (CRESCENTE)</option>
            <option value="10">SITUAÇÃO (DECRESCENTE)</option>
          </FormInputSelect>
          <FormButton
            colSm={3}
            color="primary"
            id="filtrar"
            text="FILTRAR"
            onClick={handleFilterClick}
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
              <th>VALOR (R$)</th>
              <th style={{ width: '10%' }}>VENCIMENTO</th>
              <th style={{ width: '14%' }}>VALOR PAGO (R$)</th>
              <th style={{ width: '16%' }}>DATA RECEBIMENTO</th>
              <th>SITUAÇÃO</th>
              <th style={{ width: '2%' }}>&nbsp;</th>
              <th style={{ width: '2%' }}>&nbsp;</th>
            </tr>
          </thead>

          <tbody id="tbodyBills">
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td hidden>{bill.id}</td>
                <td>{bill.bill}</td>
                <td>{bill.description}</td>
                <td>{formatarValor(bill.amount)}</td>
                <td>{formatarData(bill.dueDate)}</td>
                <td>{formatarValor(bill.amountReceived)}</td>
                <td>{bill.receiveDate ? formatarData(bill.receiveDate) : ''}</td>
                <td>
                  {bill.situation == 1
                    ? 'PENDENTE'
                    : bill.situation == 2
                    ? 'PAGO PARCIALMENTE'
                    : 'PAGO'}
                </td>
                <td>
                  <FaEdit
                    role="button"
                    color="blue"
                    size={14}
                    title="Detalhes"
                    onClick={() => {
                      if (bill.situation == 1) {
                        history.push(`/conta/receber/${bill.id}`);
                        window.location.reload();
                      }
                    }}
                  />
                </td>
                <td>
                  <FaUndo
                    role="button"
                    color="red"
                    size={14}
                    title="Estornar"
                    onClick={async () => await reversal(bill.id, bill.situation)}
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
