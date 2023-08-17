import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Button, Col, Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { useParams } from 'react-router-dom';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputGroupNumber } from '../../components/form-input-group-number';
import { FormButton } from '../../components/form-button';
import { FreightOrder } from '../../models/FreightOrder';
import { ILoadStep, LoadStep } from '../../models/LoadStep';
import { IIndividualPerson } from '../../models/IndividualPerson';
import { IEnterprisePerson } from '../../models/EnterprisePerson';
import { formatarPeso } from '../../utils/format';
import history from '../../services/history';
import axios from '../../services/axios';
import { toast } from 'react-toastify';

export function FreightOrderAuthorize(): JSX.Element {
  const [order, setOrder] = useState(new FreightOrder());

  const [steps, setSteps] = useState(new Array<ILoadStep>());

  const [loadStep, setLoadStep] = useState(new LoadStep());

  const [orderDescription, setOrderDescription] = useState('');
  const [orderDestiny, setOrderDestiny] = useState('');
  const [orderDriver, setOrderDriver] = useState('');

  const [orderTruckProprietary, setOrderTruckProprietary] = useState('');
  const [orderTruck, setOrderTruck] = useState('');
  const [orderTruckType, setOrderTruckType] = useState('');
  const [orderDistance, setOrderDistance] = useState(0);
  const [orderShipping, setOrderShipping] = useState(
    new Date().toISOString().substring(0, 10),
  );

  const [orderRepresentation, setOrderRepresentation] = useState('');
  const [orderDestinyCity, setOrderDestinyCity] = useState('');
  const [orderLoad, setOrderLoad] = useState('');

  const routeParams = useParams();
  let id = 0;
  if (routeParams.id) id = Number.parseInt(routeParams.id);

  useEffect(() => {
    const getData = async () => {
      const response = (await new FreightOrder().getOne(id)) as FreightOrder;

      if (response.steps.filter((step) => step.status == 1).length == 0) {
        alert('Todas as etapas deste pedido foram autorizadas para carregamento');
        history.push('/pedidos/frete/autorizar');
        window.location.reload();
      } else {
        setOrder(response);

        setOrderDescription(response.description);
        setOrderDestiny(response.destiny.name + ' - ' + response.destiny.state.acronym);
        setOrderDriver((response.driver.person.individual as IIndividualPerson).name);
        setOrderTruckProprietary(
          response.proprietary.person.type == 1
            ? (response.proprietary.person.individual as IIndividualPerson).name
            : (response.proprietary.person.enterprise as IEnterprisePerson).fantasyName,
        );
        setOrderTruck(response.truck.brand + ' ' + response.truck.model);
        setOrderTruckType(response.truckType.description);
        setOrderDistance(response.distance);
        setOrderShipping(response.shipping);

        setSteps(response.steps.filter((step) => step.status == 1));
        setLoadStep(new LoadStep(response.steps.filter((step) => step.status == 1)[0]));

        setOrderRepresentation(
          (
            response.steps.filter((step) => step.status == 1)[0].representation.person
              .enterprise as IEnterprisePerson
          ).fantasyName,
        );
        setOrderDestinyCity(
          response.steps.filter((step) => step.status == 1)[0].representation.person
            .contact.address.city.name +
            ' - ' +
            response.steps.filter((step) => step.status == 1)[0].representation.person
              .contact.address.city.state.acronym,
        );
        setOrderLoad(
          formatarPeso(response.steps.filter((step) => step.status == 1)[0].load),
        );
      }
    };

    const load = async () => {
      await getData();
    };

    load();
  }, []);

  //const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};

  const handleOrderDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDescription(e.target.value);
  };
  const handleOrderDestinyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDestiny(e.target.value);
  };
  const handleOrderDriverChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDriver(e.target.value);
  };

  const handleOrderTruckProprietaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderTruckProprietary(e.target.value);
  };
  const handleOrderTruckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderTruck(e.target.value);
  };
  const handleOrderTruckTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderTruckType(e.target.value);
  };
  const handleOrderDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDistance(Number.parseInt(e.target.value));
  };
  const handleOrderShippingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderShipping(e.target.value);
  };

  const handleOrderRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderRepresentation(e.target.value);
  };
  const handleOrderDestinyCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDestinyCity(e.target.value);
  };
  const handleOrderLoadChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderLoad(e.target.value);
  };

  const handleAuthorizeClick = async () => {
    if (steps.length > 0) {
      const step = loadStep.id;
      loadStep.status = 2;
      if (await loadStep.update()) {
        const newSteps = [...steps];
        newSteps.shift();
        setSteps(newSteps);
        if (newSteps.length > 0) {
          setLoadStep(new LoadStep(newSteps[0]));
          setOrderRepresentation(
            (newSteps[0].representation.person.enterprise as IEnterprisePerson)
              .fantasyName,
          );
          setOrderDestinyCity(
            newSteps[0].representation.person.contact.address.city.name +
              ' - ' +
              newSteps[0].representation.person.contact.address.city.state.acronym,
          );
          setOrderLoad(formatarPeso(newSteps[0].load));
        }

        const result = confirm(
          'Etapa de carregamento autorizada com sucesso. ' +
            '<br />Deseja imprimir o documento de autorização?',
        );
        if (result) {
          const result = await axios.get(`/load-step/${step}`);
          if (result.data) {
            const guia = window.open(
              `http://localhost:3001/reports/AutorizacaoCarregamentoPedido${order.id}Etapa${step}.pdf`,
              '_blank',
            );
          }
        }
        if (newSteps.length == 0) {
          toast.info('Todas as etapas deste pedido foram autorizadas para carregamento');
          history.push('/pedidos/frete/autorizar');
          window.location.reload();
        }
      }
    } else toast.error('Não há mais etapas para autorizar o carregamento.');
  };

  const handleBackClick = () => {
    history.push('/pedidos/frete/autorizar');
    window.location.reload();
  };

  return (
    <>
      <CardTitle text={'Autorizar Carregamento de Etapas de Pedidos de Frete'} />
      <FieldsetCard legend="Informações do pedido">
        <Row>
          <FormInputText
            colSm={5}
            id="descricao-pedido"
            label="Descrição"
            obrigatory={false}
            value={orderDescription}
            onChange={handleOrderDescriptionChange}
            readonly
          />
          <FormInputText
            colSm={4}
            id="destino-pedido"
            label="Destino"
            obrigatory={false}
            value={orderDestiny}
            onChange={handleOrderDestinyChange}
            readonly
          />
          <FormInputText
            colSm={3}
            id="motorista-pedido"
            label="Motorista"
            obrigatory={false}
            value={orderDriver}
            onChange={handleOrderDriverChange}
            readonly
          />
        </Row>
        <Row>
          <FormInputText
            colSm={3}
            id="proprietario-caminhao-pedido"
            label="Proprietário Caminhão"
            obrigatory={false}
            value={orderTruckProprietary}
            onChange={handleOrderTruckProprietaryChange}
            readonly
          />
          <FormInputText
            colSm={3}
            id="caminhao-pedido"
            label="Caminhão"
            obrigatory={false}
            value={orderTruck}
            onChange={handleOrderTruckChange}
            readonly
          />
          <FormInputText
            colSm={2}
            id="tipo-caminhao-pedido"
            label="Tipo Caminhão"
            obrigatory={false}
            value={orderTruckType}
            onChange={handleOrderTruckTypeChange}
            readonly
          />
          <FormInputGroupNumber
            colSm={2}
            id="distancia-pedido"
            label="Distância"
            groupText={'KM'}
            value={orderDistance}
            onChange={handleOrderDistanceChange}
            obrigatory={false}
            readonly
          />
          <FormInputDate
            colSm={2}
            id="entrega-pedido"
            label="Data entrega"
            obrigatory={false}
            value={orderShipping}
            onChange={handleOrderShippingChange}
            readonly
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Etapas de Carregamento do Pedido">
        <div className="table-container" style={{ height: '170px' }}>
          <Table id="tableEtapas" striped hover>
            <thead>
              <tr>
                <th>ORDEM</th>
                <th>REPRESENTAÇÃO</th>
                <th>CIDADE</th>
                <th>CARGA (Kg)</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody id="tbodyEtapas">
              {steps.map((item) => (
                <tr key={item.representation.id}>
                  <td>{item.order}</td>
                  <td>{item.representation.person.enterprise?.fantasyName}</td>
                  <td>{item.representation.unity}</td>
                  <td>{item.load}</td>
                  <td>
                    {item.status == 1
                      ? 'PENDENTE'
                      : item.status == 2
                      ? 'AUTORIZADO'
                      : 'CARREGADO'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </FieldsetCard>
      <FieldsetCard legend="Etapa a ser autorizada">
        <Row>
          <FormInputText
            colSm={4}
            id="representacao-pedido"
            label="Representação"
            obrigatory={false}
            value={orderRepresentation}
            onChange={handleOrderRepresentationChange}
            readonly
          />
          <FormInputText
            colSm={4}
            id="cidade-destino-pedido"
            label="Cidade"
            obrigatory={false}
            value={orderDestinyCity}
            onChange={handleOrderDestinyCityChange}
            readonly
          />
          <FormInputGroupText
            colSm={2}
            id="carga-pedido"
            label="Carga"
            groupText={'KG'}
            obrigatory={false}
            mask="##0,0"
            maskReversal={true}
            maskPlaceholder="0,0"
            value={orderLoad}
            onChange={handleOrderLoadChange}
            readonly
          />
          <FormButton
            colSm={2}
            color="success"
            id="autorizar"
            text="AUTORIZAR"
            onClick={handleAuthorizeClick}
          />
        </Row>
      </FieldsetCard>
      <Row>
        <Col sm="2">
          <Button
            id="voltar"
            color="secondary"
            style={{ width: '100%' }}
            size="sm"
            onClick={handleBackClick}
          >
            VOLTAR
          </Button>
        </Col>
        <Col sm="10"></Col>
      </Row>
    </>
  );
}
