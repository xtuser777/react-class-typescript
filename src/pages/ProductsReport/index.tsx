import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormButton } from '../../components/form-button';
import { FormInputSelect } from '../../components/form-input-select';
import { FormButtonLink } from '../../components/form-button-link';
import { IProduct, Product } from '../../models/Product';
import { Representation } from '../../models/Representation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import history from '../../services/history';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { formatarPeso, formatarValor } from '../../utils/format';
import axios from '../../services/axios';

export function ProductsReport(): JSX.Element {
  const [data, setData] = useState(new Array<Product>());
  const [products, setProducts] = useState(new Array<Product>());

  const [representations, setRepresentations] = useState(new Array<Representation>());

  const [filter, setfilter] = useState('');
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setfilter(e.target.value);
  };

  const [measure, setMeasure] = useState('');
  const handleMeasureChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeasure(e.target.value);
  };

  const [representation, setRepresentation] = useState('0');
  const handleRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRepresentation(e.target.value);
  };

  const [orderBy, setOrderBy] = useState('1');
  const handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderBy(e.target.value);
    setProducts(filterData(e.target.value));
  };

  useEffect(() => {
    const getRepresentations = async () => {
      const data = await new Representation().get();
      setRepresentations(data);
    };

    const getData = async () => {
      const data = await new Product().get();
      setData(data);
      setProducts(data);
    };

    const load = async () => {
      await getRepresentations();
      await getData();
    };

    load();
  }, []);

  const filterData = (orderBy: string) => {
    let filteredData: Product[] = [...data];
    if (Number(representation) > 0) {
      filteredData = filteredData.filter(
        (item) => item.representation.id == Number(representation),
      );
    }

    if (measure.length > 0) {
      filteredData = filteredData.filter((item) => item.measure.includes(measure));
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((item) => item.description.includes(filter));
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
          if (x.measure.toUpperCase() > y.measure.toUpperCase()) return 1;
          if (x.measure.toUpperCase() < y.measure.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '4':
        filteredData = filteredData.sort((x, y) => {
          if (y.measure.toUpperCase() > x.measure.toUpperCase()) return 1;
          if (y.measure.toUpperCase() < x.measure.toUpperCase()) return -1;
          return 0;
        });
        break;
      case '5':
        filteredData = filteredData.sort((x, y) => {
          if (x.weight > y.weight) return 1;
          if (x.weight < y.weight) return -1;
          return 0;
        });
        break;
      case '6':
        filteredData = filteredData.sort((x, y) => {
          if (y.weight > x.weight) return 1;
          if (y.weight < x.weight) return -1;
          return 0;
        });
        break;
      case '7':
        filteredData = filteredData.sort((x, y) => {
          if (x.price > y.price) return 1;
          if (x.price < y.price) return -1;
          return 0;
        });
        break;
      case '8':
        filteredData = filteredData.sort((x, y) => {
          if (y.price > x.price) return 1;
          if (y.price < x.price) return -1;
          return 0;
        });
        break;
      case '9':
        filteredData = filteredData.sort((x, y) => {
          if (
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() >
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return 1;
          if (
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() <
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
      case '10':
        filteredData = filteredData.sort((x, y) => {
          if (
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() >
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return 1;
          if (
            (
              y.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase() <
            (
              x.representation.person.enterprise as EnterprisePerson
            ).fantasyName.toUpperCase()
          )
            return -1;
          return 0;
        });
        break;
    }

    return filteredData;
  };

  const handleFilterClick = () => {
    setProducts(filterData(orderBy));
  };

  const handleEmitClick = async () => {
    const pays: IProduct[] = [];
    products.forEach((b) => pays.push((b as Product).toAttributes));
    const result = await axios.post(`/report/products`, {
      products: pays,
      filters: {
        filter,
        measure,
        representation,
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
        `http://localhost:3001/reports/RelatorioProdutos${fileDate.replaceAll(
          '-',
          '',
        )}-${time.trim().replaceAll(':', '')}.pdf`,
        '_blank',
      );
    }
  };

  return (
    <>
      <CardTitle text="Relatório de Produtos" />
      <FieldsetCard legend="Filtragem de Produtos">
        <Row>
          <FormInputText
            colSm={9}
            id="filtro"
            label="Filtro"
            obrigatory={false}
            value={filter}
            placeholder="Filtrar por descrição..."
            onChange={(e) => handleFilterChange(e)}
          />
          <FormInputText
            colSm={3}
            id="medida"
            label="Medida"
            obrigatory={false}
            value={measure}
            placeholder="SACO, GRANEL, ETC..."
            onChange={(e) => handleMeasureChange(e)}
          />
        </Row>
        <Row>
          <FormInputSelect
            colSm={4}
            id="representacao"
            label="Representação"
            obrigatory={false}
            value={representation}
            onChange={(e) => handleRepresentationChange(e)}
          >
            <option value="0">SELECIONE</option>
            {representations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.person.enterprise?.fantasyName + ' (' + item.unity + ')'}
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
            <option value="1">DESCRIÇÃO (CRESCENTE)</option>
            <option value="2">DESCRIÇÃO (DECRESCENTE)</option>
            <option value="3">MEDIDA (CRESCENTE)</option>
            <option value="4">MEDIDA (DECRESCENTE)</option>
            <option value="5">PESO (CRESCENTE)</option>
            <option value="6">PESO (DECRESCENTE)</option>
            <option value="7">PREÇO (CRESCENTE)</option>
            <option value="8">PREÇO (DECRESCENTE)</option>
            <option value="9">REPRESENTAÇÃO (CRESCENTE)</option>
            <option value="10">REPRESENTAÇÃO (DECRESCENTE)</option>
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
      <FieldsetCard legend="Produtos Cadastrados">
        <Table id="tableProducts" size="sm" striped hover responsive>
          <thead>
            <tr>
              <th hidden>ID</th>
              <th style={{ width: '40%' }}>DESCRIÇÃO</th>
              <th style={{ width: '16%;' }}>MEDIDA</th>
              <th style={{ width: '12%;' }}>PESO (KG)</th>
              <th style={{ width: '12%;' }}>PREÇO (R$)</th>
              <th>REPRESENTAÇÂO</th>
            </tr>
          </thead>

          <tbody id="tbodyProducts">
            {products.map((item) => (
              <tr key={item.id}>
                <td hidden>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.measure}</td>
                <td>{formatarPeso(item.weight)}</td>
                <td>{formatarValor(item.price)}</td>
                <td>{item.representation.person.enterprise?.fantasyName}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </FieldsetCard>
    </>
  );
}
