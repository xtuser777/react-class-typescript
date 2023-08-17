import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Col, Row } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputDate } from '../../components/form-input-date';
import { useParams } from 'react-router-dom';
import { FormInputTextarea } from '../../components/form-input-textarea';
import { FreightOrder } from '../../models/FreightOrder';
import { IStatus, Status } from '../../models/Status';
import { OrderStatus } from '../../models/OrderStatus';
import { FormInputTime } from '../../components/form-input-time';
import history from '../../services/history';

export function FreightOrderStatus(): JSX.Element {
  const [order, setOrder] = useState(new FreightOrder());
  const [orderStatus, setOrderStatus] = useState(new OrderStatus());

  const [statuses, setStatuses] = useState(new Array<IStatus>());

  const [orderDescription, setOrderDescription] = useState('');
  const [orderCurrentStatus, setOrderCurrentStatus] = useState('');
  const [orderStatusDate, setOrderStatusDate] = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [orderStatusTime, setOrderStatusTime] = useState(
    new Date().toISOString().substring(11, 19),
  );

  const [status, setStatus] = useState('0');
  const [errorStatus, setErrorStatus] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [errorDate, setErrorDate] = useState<string | undefined>(undefined);
  const [time, setTime] = useState(new Date().toISOString().substring(11, 19));
  const [errorTime, setErrorTime] = useState<string | undefined>(undefined);
  const [observation, setObservation] = useState('');

  const routeParams = useParams();
  let id = 0;
  if (routeParams.id) id = Number.parseInt(routeParams.id);

  useEffect(() => {
    const getStatuses = async () => {
      const response = await new Status().get();
      response.shift();
      response.shift();
      setStatuses(response);
    };

    const getData = async () => {
      const response = (await new FreightOrder().getOne(id)) as FreightOrder;
      if (response.status.status.id == 1) {
        alert('Este pedido ainda não foi carregado.');
        history.push(`/pedidos/frete/status`);
        return window.location.reload();
      } else {
        if (response.status.status.id == 2) {
          let statusCount = 0;
          for (const step of response.steps) {
            if (step.status == 1) statusCount += 1;
          }
          if (statusCount > 0) {
            alert('Este pedido ainda não foi carregado.');
            history.push(`/pedidos/frete/status`);
            return window.location.reload();
          }
        }
        setOrder(response);

        setOrderStatus(new OrderStatus(order.status));

        setOrderDescription(response.description);
        setOrderCurrentStatus(response.status.status.description);
        setOrderStatusDate(response.status.date);
        setOrderStatusTime(response.status.time);
      }
    };

    const load = async () => {
      await getStatuses();
      await getData();
    };

    load();
  }, []);

  const validate = {
    status: (value: string) => {
      if (value == '0') {
        setErrorStatus('O novo status do pedido precisa ser selecionado');
        return false;
      } else {
        setErrorStatus(undefined);
        orderStatus.status = (
          statuses.find((status) => status.id == Number(value)) as Status
        ).toAttributes;
        return true;
      }
    },
    date: (value: string) => {
      const val = new Date(value + 'T12:00:00');
      const now = new Date(Date.now());
      if (value.length == 0) {
        setErrorDate('A data do status precisa ser preenchida.');
        return false;
      } else if (
        now.getFullYear() == val.getFullYear() &&
        now.getMonth() == val.getMonth() &&
        now.getDate() < val.getDate()
      ) {
        setErrorDate('A data do status preenchida é inválida.');
        return false;
      } else {
        setErrorDate(undefined);
        orderStatus.date = value;
        return true;
      }
    },
    time: (value: string) => {
      if (value == '') {
        setErrorTime('A hora do status precisa ser preenchida.');
        return false;
      } else {
        setErrorTime(undefined);
        orderStatus.time = value;
        return true;
      }
    },
  };

  //const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};

  const handleOrderDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDescription(e.target.value);
  };
  const handleOrderCurrentStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderCurrentStatus(e.target.value);
  };
  const handleOrderStatusDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderStatusDate(e.target.value);
  };
  const handleOrderStatusTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderStatusTime(e.target.value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
    validate.status(e.target.value);
  };
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    validate.date(e.target.value);
  };
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    validate.time(e.target.value);
  };
  const handleObservationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setObservation(e.target.value);
    orderStatus.observation = e.target.value;
  };

  const clearFields = () => {
    setStatus('0');
    setDate('');
    setTime('');
    setObservation('');
  };

  const validateFields = () => {
    return validate.status(status) && validate.date(date) && validate.time(time);
  };

  const persistData = async () => {
    if (validateFields()) {
      await orderStatus.update(id);
    }
  };

  const handleButtons = {
    handleClearClick: () => {
      clearFields();
    },
    handleSaveClick: async () => {
      await persistData();
    },
  };

  return (
    <>
      <CardTitle text={'Alterar Status do Pedido'} />
      <FieldsetCard legend="Status Atual do Pedido">
        <Row>
          <FormInputText
            colSm={6}
            id="descricao-pedido"
            label="Descrição do pedido"
            obrigatory={false}
            value={orderDescription}
            onChange={(e) => handleOrderDescriptionChange(e)}
            readonly
          />
          <FormInputText
            colSm={2}
            id="status-atual-pedido"
            label="Status do pedido"
            obrigatory={false}
            value={orderCurrentStatus}
            onChange={(e) => handleOrderCurrentStatusChange(e)}
            readonly
          />
          <FormInputDate
            colSm={2}
            id="data-status-pedido"
            label="Data do status"
            obrigatory={false}
            value={orderStatusDate}
            onChange={(e) => handleOrderStatusDateChange(e)}
            readonly
          />
          <FormInputTime
            colSm={2}
            id="hora-status-pedido"
            label="Hora do status"
            obrigatory={false}
            value={orderStatusTime}
            onChange={(e) => handleOrderStatusTimeChange(e)}
            readonly
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Novo Status do Pedido" obrigatoryFields>
        <Row>
          <Col sm="4">
            <Row>
              <FormInputSelect
                colSm={12}
                id="novo-status"
                label="Novo Status"
                obrigatory
                value={status}
                onChange={handleStatusChange}
                message={errorStatus}
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
              <FormInputDate
                colSm={6}
                id="data-status"
                label="Data"
                obrigatory
                value={date}
                onChange={handleDateChange}
                message={errorDate}
              />
              <FormInputTime
                colSm={6}
                id="time-status"
                label="Hora"
                obrigatory
                value={time}
                onChange={handleTimeChange}
                message={errorTime}
              />
            </Row>
          </Col>
          <Col sm="8">
            <Row>
              <FormInputTextarea
                colSm={12}
                label={'Observações'}
                id={'observations'}
                rows={5}
                obrigatory={false}
                value={observation}
                onChange={handleObservationChange}
              />
            </Row>
          </Col>
        </Row>
      </FieldsetCard>
      <FormButtonsSave
        backLink="/pedidos/frete/status"
        clear={false}
        handle={handleButtons}
      />
    </>
  );
}
