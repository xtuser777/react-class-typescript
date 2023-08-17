import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FreightOrder, IFreightOrder } from '../../models/FreightOrder';
import { IStatus, Status } from '../../models/Status';
import { formatarData, formatarValor } from '../../utils/format';
import { IndividualPerson } from '../../models/IndividualPerson';
import { Client, IClient } from '../../models/Client';
import axios from '../../services/axios';

export function FreightOrdersReport(): JSX.Element {
  const [data, setData] = useState(new Array<IFreightOrder>());
  const [orders, setOrders] = useState(new Array<IFreightOrder>());

  const [statuses, setStatuses] = useState(new Array<IStatus>());

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

  const [status, setStatus] = useState('0');
  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const [client, setClient] = useState('0');
  const handleClientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClient(e.target.value);
  };

  const [orderBy, setOrderBy] = useState('1');
  const handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setOrders(filterData(e.target.value));
  };

  useEffect(() => {
    const getStatuses = async () => {
      const response = await new Status().get();
      setStatuses(response);
    };

    const getClients = async () => {
      const clients = await new Client().get();
      setClients(clients);
    };

    const getData = async () => {
      const response = await new FreightOrder().get();
      setData(response);
      setOrders(response);
    };

    const load = async () => {
      await getStatuses();
      await getClients();
      await getData();
    };

    load();
  }, []);

  const filterData = (orderBy: string) => {
    let filteredData: IFreightOrder[] = [...data];
    if (dateInit.length == 10 && dateEnd.length == 10) {
      filteredData = filteredData.filter(
        (item) =>
          item.date.substring(0, 10) >= dateInit && item.date.substring(0, 10) <= dateEnd,
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((item) => item.description.includes(filter));
    }

    if (status != '0') {
      filteredData = filteredData.filter(
        (item) => item.status.status.id == Number(status),
      );
    }

    if (client != '0') {
      filteredData = filteredData.filter((item) => item.client.id == Number(client));
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
          if (x.date.toUpperCase() > y.date.toUpperCase()) return 1;
          if (x.date.toUpperCase() < y.date.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (y.date.toUpperCase() > x.date.toUpperCase()) return 1;
          if (y.date.toUpperCase() < x.date.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '5':
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
      case '6':
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
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (
            x.paymentFormFreight.description.toUpperCase() >
            y.paymentFormFreight.description.toUpperCase()
          )
            return 1;
          if (
            x.paymentFormFreight.description.toUpperCase() <
            y.paymentFormFreight.description.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (
            y.paymentFormFreight.description.toUpperCase() >
            x.paymentFormFreight.description.toUpperCase()
          )
            return 1;
          if (
            y.paymentFormFreight.description.toUpperCase() <
            x.paymentFormFreight.description.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (
            x.status.status.description.toUpperCase() >
            y.status.status.description.toUpperCase()
          )
            return 1;
          if (
            x.status.status.description.toUpperCase() <
            y.status.status.description.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (
            y.status.status.description.toUpperCase() >
            x.status.status.description.toUpperCase()
          )
            return 1;
          if (
            y.status.status.description.toUpperCase() <
            x.status.status.description.toUpperCase()
          )
            return -1;
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
    setOrders(filterData(orderBy));
  };

  const handleEmitClick = async () => {
    const freights: IFreightOrder[] = [];
    orders.forEach((o) => freights.push((o as FreightOrder).toAttributes));
    const result = await axios.post(`/report/freight-orders`, {
      orders: freights,
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
        `http://localhost:3001/reports/RelatorioPedidosFrete${fileDate.replaceAll(
          '-',
          '',
        )}-${time.trim().replaceAll(':', '')}.pdf`,
        '_blank',
      );
    }
  };

  return (
    <>
      <CardTitle text="Relatório Pedidos de Frete" />
      <FieldsetCard legend="Filtragem de Pedidos">
        <Row>
          <FormInputText
            colSm={6}
            id="filtro"
            label="Filtro"
            obrigatory={false}
            value={filter}
            placeholder="Filtrar por descrição..."
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
          <FormInputSelect
            colSm={2}
            id="status"
            label="Status"
            obrigatory={false}
            value={status}
            onChange={(e) => handleStatusChange(e)}
          >
            <option value="0">SELECIONE</option>
            {statuses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </FormInputSelect>
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
            <option value="3">DATA (CRESCENTE)</option>
            <option value="4">DATA (DECRESCENTE)</option>
            <option value="5">AUTOR (CRESCENTE)</option>
            <option value="6">AUTOR (DECRESCENTE)</option>
            <option value="7">FORMA PAGAMENTO (CRESCENTE)</option>
            <option value="8">FORMA PAGAMENTO (DECRESCENTE)</option>
            <option value="9">STATUS (CRESCENTE)</option>
            <option value="10">STATUS (DECRESCENTE)</option>
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
      <FieldsetCard legend="Pedidos Abertos">
        <Table id="tableOrders" size="sm" striped hover responsive>
          <thead>
            <tr>
              <th hidden>ID</th>
              <th>DESCRIÇÃO</th>
              <th>CLIENTE</th>
              <th>MOTORISTA</th>
              <th>DATA</th>
              <th>AUTOR</th>
              <th>DESTINO</th>
              <th>FORMA PAG.</th>
              <th>STATUS</th>
              <th>VALOR (R$)</th>
            </tr>
          </thead>

          <tbody id="tbodyOrders">
            {orders.map((item) => (
              <tr key={item.id}>
                <td hidden>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  {item.client.person.type == 1
                    ? item.client.person.individual?.name
                    : item.client.person.enterprise?.fantasyName}
                </td>
                <td>{item.driver.person.individual?.name}</td>
                <td>{formatarData(item.date)}</td>
                <td>{item.author.person.individual?.name}</td>
                <td>{item.destiny.name + '-' + item.destiny.state.acronym}</td>
                <td>{item.paymentFormFreight.description}</td>
                <td>{item.status.status.description}</td>
                <td>{formatarValor(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </FieldsetCard>
    </>
  );
}
