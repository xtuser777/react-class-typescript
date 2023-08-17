import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { ISaleOrder, SaleOrder } from '../../models/SaleOrder';
import { formatarData, formatarValor } from '../../utils/format';
import { FaEdit, FaTrash } from 'react-icons/fa';
import history from '../../services/history';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { IndividualPerson } from '../../models/IndividualPerson';

export function SalesOrders(): JSX.Element {
  const [data, setData] = useState(new Array<ISaleOrder>());
  const [orders, setOrders] = useState(new Array<ISaleOrder>());

  const [filter, setfilter] = useState('');
  const [dateInit, setDateInit] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [orderBy, setOrderBy] = useState('1');

  useEffect(() => {
    const getData = async () => {
      const data = await new SaleOrder().get();
      setData(data);
      setOrders(data);
    };

    getData();
  }, []);

  const filterData = (orderBy: string) => {
    let filteredData: ISaleOrder[] = [...data];
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
          if (
            x.paymentForm.description.toUpperCase() >
            y.paymentForm.description.toUpperCase()
          )
            return 1;
          if (
            x.paymentForm.description.toUpperCase() <
            y.paymentForm.description.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (
            y.paymentForm.description.toUpperCase() >
            x.paymentForm.description.toUpperCase()
          )
            return 1;
          if (
            y.paymentForm.description.toUpperCase() <
            x.paymentForm.description.toUpperCase()
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
  const handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setOrders(filterData(e.target.value));
  };

  const handleFilterClick = () => {
    setOrders(filterData(orderBy));
  };

  const remove = async (id: number) => {
    const response = confirm('Confirma a exclusão deste pedido?');
    if (response) {
      const order = orders.find((item) => item.id == id) as SaleOrder;
      if (await order.delete()) {
        const newData: ISaleOrder[] = [];
        data.forEach((o) => {
          if (o.id != id) newData.push(o);
        });
        setData(newData);
        const newOrders: ISaleOrder[] = [];
        orders.forEach((o) => {
          if (o.id != id) newOrders.push(o);
        });
        setOrders(newOrders);
      }
    }
  };

  return (
    <>
      <CardTitle text="Controlar Pedidos de Venda" />
      <FieldsetCard legend="Filtragem de Pedidos">
        <Row>
          <FormInputText
            colSm={5}
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
          <FormButton
            colSm={3}
            color="primary"
            id="filtrar"
            text="FILTRAR"
            onClick={handleFilterClick}
          />
        </Row>
        <Row>
          <FormInputSelect
            colSm={9}
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
            <option value="9">FORMA PAGAMENTO (CRESCENTE)</option>
            <option value="10">FORMA PAGAMENTO (DECRESCENTE)</option>
            <option value="11">VALOR (CRESCENTE)</option>
            <option value="12">VALOR (DECRESCENTE)</option>
          </FormInputSelect>
          <FormButtonLink
            colSm={3}
            color="success"
            id="novo"
            text="NOVO"
            to="/pedido/venda/abrir"
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Pedidos Abertos">
        <Table id="tableOrders" size="sm" striped hover responsive>
          <thead>
            <tr>
              <th className="hidden">ID</th>
              <th>DESCRIÇÃO</th>
              <th>CLIENTE</th>
              <th>DATA</th>
              <th>AUTOR</th>
              <th>FORMA PAGAMENTO</th>
              <th>VALOR (R$)</th>
              <th style={{ width: '2%' }}>&nbsp;</th>
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
                <td>{item.paymentForm.description}</td>
                <td>{formatarValor(item.value)}</td>
                <td>
                  <FaEdit
                    role="button"
                    color="blue"
                    size={14}
                    title="Detalhes"
                    onClick={() => {
                      history.push(`/pedido/venda/detalhes/${item.id}`);
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
                    onClick={async () => await remove(item.id)}
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
