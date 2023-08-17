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
import { IIndividualPerson } from '../../models/IndividualPerson';
import { formatarData, formatarValor } from '../../utils/format';
import { FaEdit } from 'react-icons/fa';
import history from '../../services/history';

export function FreightOrdersStatus(): JSX.Element {
  const [data, setData] = useState(new Array<IFreightOrder>());
  const [orders, setOrders] = useState(new Array<IFreightOrder>());

  const [statuses, setStatuses] = useState(new Array<IStatus>());

  const [filter, setfilter] = useState('');
  const [dateInit, setDateInit] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [status, setStatus] = useState('0');
  const [orderBy, setOrderBy] = useState('1');

  useEffect(() => {
    const getStatuses = async () => {
      const response = await new Status().get();
      setStatuses(response);
    };

    const getData = async () => {
      const response = (await new FreightOrder().get()).filter(
        (order) => order.status.status.id != 1,
      );
      setData(response);
      setOrders(response);
    };

    const load = async () => {
      await getStatuses();
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
            (x.author.person.individual as IIndividualPerson).name.toUpperCase() >
            (y.author.person.individual as IIndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (y.author.person.individual as IIndividualPerson).name.toUpperCase() <
            (x.author.person.individual as IIndividualPerson).name.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (
            (y.author.person.individual as IIndividualPerson).name.toUpperCase() >
            (x.author.person.individual as IIndividualPerson).name.toUpperCase()
          )
            return 1;
          if (
            (y.author.person.individual as IIndividualPerson).name.toUpperCase() <
            (x.author.person.individual as IIndividualPerson).name.toUpperCase()
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

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setfilter(e.target.value);
  };
  const handleDateInitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateInit(e.target.value);
  };
  const handleDateEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);
  };
  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };
  const handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setOrders(filterData(e.target.value));
  };

  const handleFilterClick = () => {
    setOrders(filterData(orderBy));
  };

  return (
    <>
      <CardTitle text="Alterar Status de Pedidos de Frete" />
      <FieldsetCard legend="Filtragem de Pedidos">
        <Row>
          <FormInputText
            colSm={8}
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
        </Row>
        <Row>
          <FormInputSelect
            colSm={3}
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
          <FormInputSelect
            colSm={6}
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
            colSm={3}
            color="primary"
            id="filtrar"
            text="FILTRAR"
            onClick={handleFilterClick}
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Pedidos Abertos">
        <Table id="tableOrders" size="sm" striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>DESCRIÇÃO</th>
              <th>CLIENTE</th>
              <th>DATA</th>
              <th>AUTOR</th>
              <th>FORMA PAGAMENTO</th>
              <th>STATUS</th>
              <th>VALOR (R$)</th>
              <th style={{ width: '2%' }}>&nbsp;</th>
            </tr>
          </thead>

          <tbody id="tbodyOrders">
            {orders.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  {item.client.person.type == 1
                    ? item.client.person.individual?.name
                    : item.client.person.enterprise?.fantasyName}
                </td>
                <td>{formatarData(item.date)}</td>
                <td>{item.author.person.individual?.name}</td>
                <td>{item.paymentFormFreight.description}</td>
                <td>{item.status.status.description}</td>
                <td>{formatarValor(item.value)}</td>
                <td>
                  <FaEdit
                    role="button"
                    color="blue"
                    size={14}
                    title="Alterar Status"
                    onClick={() => {
                      history.push(`/pedido/frete/status/${item.id}`);
                      window.location.reload();
                    }}
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
