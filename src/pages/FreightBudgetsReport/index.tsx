import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FreightBudget, IFreightBudget } from '../../models/FreightBudget';
import { IndividualPerson } from '../../models/IndividualPerson';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { formatarData, formatarValor } from '../../utils/format';
import axios from '../../services/axios';
import { Client, IClient } from '../../models/Client';

export function FreightBudgetsReport(): JSX.Element {
  const [data, setData] = useState(new Array<IFreightBudget>());
  const [budgets, setBudgets] = useState(new Array<IFreightBudget>());

  const [clients, setClients] = useState(new Array<IClient>());

  const [filter, setfilter] = useState('');
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setfilter(e.target.value);
  };

  const [dateInit, setDateInit] = useState('');
  const handleDateInitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateInit(e.target.value);
  };

  const [dateEnd, setDateEnd] = useState('');
  const handleDateEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);
  };

  const [client, setClient] = useState('0');
  const handleClientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClient(e.target.value);
  };

  const [orderBy, setOrderBy] = useState('1');
  const handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setBudgets(filterData(e.target.value));
  };

  useEffect(() => {
    const getClients = async () => {
      const clients = await new Client().get();
      setClients(clients);
    };

    const getData = async () => {
      const data = await new FreightBudget().get();
      setData(data);
      setBudgets(data);
    };

    getClients();
    getData();
  }, []);

  const filterData = (orderBy: string) => {
    let filteredData: IFreightBudget[] = [...data];
    if (dateInit.length == 10 && dateEnd.length == 10) {
      filteredData = filteredData.filter(
        (item) =>
          item.date.substring(0, 10) >= dateInit && item.date.substring(0, 10) <= dateEnd,
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter(
        (item) =>
          (item.client.person.type == 1
            ? item.client.person.individual?.name.includes(filter)
            : item.client.person.enterprise?.fantasyName.includes(filter)) ||
          item.description.includes(filter),
      );
    }

    if (client != '0') {
      filteredData = filteredData.filter((item) => item.client?.id == Number(client));
    }

    switch (orderBy) {
      case '1':
        filteredData = filteredData.sort((x, y) => {
          if (x.description.toUpperCase() > y.description.toUpperCase()) return 1;
          if (x.description.toUpperCase() < y.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '2':
        filteredData = filteredData.sort((x, y) => {
          if (y.description.toUpperCase() > x.description.toUpperCase()) return 1;
          if (y.description.toUpperCase() < x.description.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '3':
        filteredData = filteredData.sort((x, y) => {
          if (
            (x.client.person.type == 1
              ? (x.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  x.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase()) >
            (y.client.person.type == 1
              ? (y.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  y.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase())
          )
            return 1;
          if (
            (x.client.person.type == 1
              ? (x.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  x.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase()) <
            (y.client.person.type == 1
              ? (y.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  y.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase())
          )
            return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (
            (y.client.person.type == 1
              ? (y.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  y.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase()) >
            (x.client.person.type == 1
              ? (x.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  x.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase())
          )
            return 1;
          if (
            (y.client.person.type == 1
              ? (y.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  y.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase()) <
            (x.client.person.type == 1
              ? (x.client.person.individual as IndividualPerson).name.toUpperCase()
              : (
                  x.client.person.enterprise as EnterprisePerson
                ).fantasyName.toUpperCase())
          )
            return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.date.toUpperCase() > y.date.toUpperCase()) return 1;
          if (x.date.toUpperCase() < y.date.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.date.toUpperCase() > x.date.toUpperCase()) return 1;
          if (y.date.toUpperCase() < x.date.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (
            (x.author.person.individual as IndividualPerson).name.toUpperCase() >
            (y.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (y.author.person.individual as IndividualPerson).name.toUpperCase() <
            (x.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (
            (y.author.person.individual as IndividualPerson).name.toUpperCase() >
            (x.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (y.author.person.individual as IndividualPerson).name.toUpperCase() <
            (x.author.person.individual as IndividualPerson).name.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (x.validate.toUpperCase() > y.validate.toUpperCase()) return 1;
          if (x.validate.toUpperCase() < y.validate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (y.validate.toUpperCase() > x.validate.toUpperCase()) return 1;
          if (y.validate.toUpperCase() < x.validate.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '11':
        filteredData = filteredData.sort((x, y) => x.value - y.value);
        break;
      case '12':
        filteredData = filteredData.sort((x, y) => y.value - x.value);
        break;
    }

    return filteredData;
  };

  const handleFilterClick = () => {
    setBudgets(filterData(orderBy));
  };

  const handleEmitClick = async () => {
    const freights: IFreightBudget[] = [];
    budgets.forEach((o) => freights.push((o as FreightBudget).toAttributes));
    const result = await axios.post(`/report/freight-budgets`, {
      budgets: freights,
      filters: { filter, dateInit, dateEnd, status, client, orderBy },
    });
    if (result.data) {
      const fileDate = new Date().toISOString().substring(0, 10);
      const time = new Date()
        .toLocaleTimeString('en-US', {
          timeZone: 'America/Sao_Paulo',
        })
        .substring(0, 8);
      const guia = window.open(
        `http://localhost:3001/reports/RelatorioOrcamentosFrete${fileDate.replaceAll(
          '-',
          '',
        )}-${time.trim().replaceAll(':', '')}.pdf`,
        '_blank',
      );
    }
  };

  return (
    <>
      <CardTitle text="Relatório de Orçamentos de Frete" />
      <FieldsetCard legend="Filtragem de Orçamentos">
        <Row>
          <FormInputText
            colSm={8}
            id="filtro"
            label="Filtro"
            obrigatory={false}
            value={filter}
            placeholder="Filtrar por descrição e cliente..."
            onChange={(e) => handleFilterChange(e)}
          />
          <FormInputDate
            colSm={2}
            id="data-inicio"
            label="Data Início"
            obrigatory={false}
            value={dateInit}
            onChange={(e) => handleDateInitChange(e)}
          />
          <FormInputDate
            colSm={2}
            id="data-fim"
            label="Data Fim"
            obrigatory={false}
            value={dateEnd}
            onChange={(e) => handleDateEndChange(e)}
          />
        </Row>
        <Row>
          <FormInputSelect
            colSm={4}
            id="client"
            label="Cliente"
            obrigatory={false}
            value={client}
            onChange={(e) => handleClientChange(e)}
          >
            <option value="0">SELECIONE</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.person.type == 1
                  ? c.person.individual?.name
                  : c.person.enterprise?.fantasyName}
              </option>
            ))}
          </FormInputSelect>
          <FormInputSelect
            colSm={4}
            id="order"
            label="Ordernar por"
            obrigatory={false}
            value={orderBy}
            onChange={(e) => handleOrderChange(e)}
          >
            <option value="1">DESCRIÇÂO (CRESCENTE)</option>
            <option value="2">DESCRIÇÂO (DECRESCENTE)</option>
            <option value="3">CLIENTE (CRESCENTE)</option>
            <option value="4">CLIENTE (DECRESCENTE)</option>
            <option value="5">DATA (CRESCENTE)</option>
            <option value="6">DATA (DECRESCENTE)</option>
            <option value="7">AUTOR (CRESCENTE)</option>
            <option value="8">AUTOR (DECRESCENTE)</option>
            <option value="9">VENDEDOR (CRESCENTE)</option>
            <option value="10">VENDEDOR (DECRESCENTE)</option>
            <option value="11">VALOR (CRESCENTE)</option>
            <option value="12">VALOR (DECRESCENTE)</option>
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
      <FieldsetCard legend="Orçamentos Abertos">
        <Table id="tableBudgets" size="sm" striped hover responsive>
          <thead>
            <tr>
              <th className="hidden">ID</th>
              <th>DESCRIÇÃO</th>
              <th>CLIENTE</th>
              <th>DATA</th>
              <th>DESTINO</th>
              <th>AUTOR</th>
              <th>VENCIMENTO</th>
              <th>VALOR (R$)</th>
            </tr>
          </thead>

          <tbody id="tbodyBudgets">
            {budgets.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  {item.client.person.type == 1
                    ? item.client.person.individual?.name
                    : item.client.person.enterprise?.fantasyName}
                </td>
                <td>{formatarData(item.date)}</td>
                <td>{item.destiny.name + '-' + item.destiny.state.acronym}</td>
                <td>{item.author.person.individual?.name}</td>
                <td>{formatarData(item.validate)}</td>
                <td>{formatarValor(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </FieldsetCard>
    </>
  );
}
