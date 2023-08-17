import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { Client, IClient } from '../../models/Client';
import { IndividualPerson } from '../../models/IndividualPerson';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { formatarData } from '../../utils/format';
import axios from '../../services/axios';

export function ClientsReport(): JSX.Element {
  const [data, setData] = useState(new Array<IClient>());
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

  const [type, setType] = useState('0');
  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const [orderBy, setOrderBy] = useState('1');
  const handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setClients(filterData(e.target.value));
  };

  useEffect(() => {
    const getData = async () => {
      const clientsDB = await new Client().get();
      setData(clientsDB);
      setClients(clientsDB);
    };

    getData();
  }, []);

  const filterData = (orderBy: string) => {
    let filteredData: IClient[] = [...data];
    if (dateInit.length == 10 && dateEnd.length == 10) {
      filteredData = filteredData.filter(
        (item) =>
          item.register.substring(0, 10) >= dateInit &&
          item.register.substring(0, 10) <= dateEnd,
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

    if (type != '0') {
      filteredData = filteredData.filter((item) => item.person.type == Number(type));
    }

    switch (orderBy) {
      case '1':
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
      case '2':
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
      case '3':
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
      case '4':
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
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.register > y.register) return 1;
          if (x.register < y.register) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.register > x.register) return 1;
          if (y.register < x.register) return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (x.person.contact.phone.toUpperCase() > y.person.contact.phone.toUpperCase())
            return 1;
          if (x.person.contact.phone.toUpperCase() < y.person.contact.phone.toUpperCase())
            return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (y.person.contact.phone.toUpperCase() > x.person.contact.phone.toUpperCase())
            return 1;
          if (y.person.contact.phone.toUpperCase() < x.person.contact.phone.toUpperCase())
            return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (
            x.person.contact.cellphone.toUpperCase() >
            y.person.contact.cellphone.toUpperCase()
          )
            return 1;
          if (
            x.person.contact.cellphone.toUpperCase() <
            y.person.contact.cellphone.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (y.person.contact.phone.toUpperCase() > x.person.contact.phone.toUpperCase())
            return 1;
          if (y.person.contact.phone.toUpperCase() < x.person.contact.phone.toUpperCase())
            return -1;
          return 0;
        });
        break;
      case '11':
        filteredData = filteredData.sort((x, y) => x.person.type - y.person.type);
        break;
      case '12':
        filteredData = filteredData.sort((x, y) => y.person.type - x.person.type);
        break;
      case '13':
        filteredData = filteredData.sort((x, y) => {
          if (x.person.contact.email.toUpperCase() > y.person.contact.email.toUpperCase())
            return 1;
          if (x.person.contact.email.toUpperCase() < y.person.contact.email.toUpperCase())
            return -1;
          return 0;
        });
        break;
      case '14':
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

  const handleFilterClick = () => {
    setClients(filterData(orderBy));
  };

  const handleEmitClick = async () => {
    const cli: IClient[] = [];
    clients.forEach((c) => cli.push((c as Client).toAttributes));
    const result = await axios.post(`/report/clients`, {
      clients: cli,
      filters: { filter, dateInit, dateEnd, type, orderBy },
    });
    if (result.data) {
      const fileDate = new Date().toISOString().substring(0, 10);
      const time = new Date()
        .toLocaleTimeString('en-US', {
          timeZone: 'America/Sao_Paulo',
        })
        .substring(0, 8);
      const guia = window.open(
        `http://localhost:3001/reports/RelatorioClientes${fileDate.replaceAll(
          '-',
          '',
        )}-${time.trim().replaceAll(':', '')}.pdf`,
        '_blank',
      );
    }
  };

  return (
    <>
      <CardTitle text="Relatório de Clientes" />
      <FieldsetCard legend="Filtragem de Clientes">
        <Row>
          <FormInputText
            colSm={6}
            id="filtro"
            label="Filtro"
            obrigatory={false}
            value={filter}
            placeholder="Filtrar por nome e email..."
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
            id="tipo-pessoa"
            label="Tipo"
            obrigatory={false}
            value={type}
            onChange={(e) => handleTypeChange(e)}
          >
            <option value="0">SELECIONE</option>
            <option value="1">FÍSICA</option>
            <option value="2">JURÍDICA</option>
          </FormInputSelect>
        </Row>
        <Row>
          <FormInputSelect
            colSm={6}
            id="order"
            label="Ordernar por"
            obrigatory={false}
            value={orderBy}
            onChange={(e) => handleOrderChange(e)}
          >
            <option value="1">NOME (CRESCENTE)</option>
            <option value="2">NOME (DECRESCENTE)</option>
            <option value="3">CPF/CNPJ (CRESCENTE)</option>
            <option value="4">CPF/CNPJ (DECRESCENTE)</option>
            <option value="5">CADASTRO (CRESCENTE)</option>
            <option value="6">CADASTRO (DECRESCENTE)</option>
            <option value="7">TELEFONE (CRESCENTE)</option>
            <option value="8">TELEFONE (DECRESCENTE)</option>
            <option value="9">CELULAR (CRESCENTE)</option>
            <option value="10">CELULAR (DECRESCENTE)</option>
            <option value="11">TIPO (CRESCENTE)</option>
            <option value="12">TIPO (DECRESCENTE)</option>
            <option value="13">EMAIL (CRESCENTE)</option>
            <option value="14">EMAIL (DECRESCENTE)</option>
          </FormInputSelect>
          <FormButton
            colSm={3}
            color="primary"
            id="filtrar"
            text="FILTRAR"
            onClick={handleFilterClick}
          />
          <FormButton
            colSm={3}
            color="info"
            id="emitir"
            text="EMITIR PDF"
            onClick={handleEmitClick}
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Clientes listados">
        <Table id="tableClients" size="sm" striped hover responsive>
          <thead>
            <tr>
              <th hidden>ID</th>
              <th style={{ width: '30%' }}>NOME/NOME FANTASIA</th>
              <th style={{ width: '15%' }}>CPF/CNPJ</th>
              <th style={{ width: '8%' }}>CADASTRO</th>
              <th style={{ width: '13%' }}>TELEFONE</th>
              <th style={{ width: '15%' }}>CELULAR</th>
              <th style={{ width: '6%' }}>TIPO</th>
              <th>EMAIL</th>
            </tr>
          </thead>

          <tbody id="tbodyClients">
            {clients.map((item) => (
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
                <td>{item.person.contact.phone}</td>
                <td>{item.person.contact.cellphone}</td>
                <td>{item.person.type == 1 ? 'Física' : 'Juridica'}</td>
                <td>
                  {item.person.type == 1
                    ? item.person.contact.email
                    : item.person.contact.email}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </FieldsetCard>
    </>
  );
}
