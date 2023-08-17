import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Button, Col, Row } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputSelect } from '../../components/form-input-select';
import { useParams } from 'react-router-dom';
import { ReceiveBill as ReceiveBillModel } from '../../models/ReceiveBill';
import { IPaymentForm, PaymentForm } from '../../models/PaymentForm';
import { formatarValor } from '../../utils/format';
import history from '../../services/history';

export function ReceiveBill(): JSX.Element {
  const [receiveBill, setReceiveBill] = useState(new ReceiveBillModel());

  const [forms, setForms] = useState(new Array<IPaymentForm>());

  const routeParams = useParams();
  let id = 0;
  if (routeParams.id) id = Number.parseInt(routeParams.id);

  const [bill, setBill] = useState('');
  const handleBillChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBill(e.target.value);
  };

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const [description, setDescription] = useState('');
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const [source, setSource] = useState('');
  const handleSourceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
  };

  const [payer, setPayer] = useState('');
  const handlePayerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPayer(e.target.value);
  };

  const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));
  const handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const [amount, setAmount] = useState('');
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const [situation, setSituation] = useState('');
  const handleSituationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSituation(e.target.value);
  };

  const [form, setForm] = useState('0');
  const [errorForm, setErrorForm] = useState<string | undefined>(undefined);
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(e.target.value);
    validate.form(e.target.value);
  };

  const [amountReceived, setAmountReceived] = useState('');
  const [errorAmountReceived, setErrorAmountReceived] = useState<string | undefined>(
    undefined,
  );
  const handleAmountReceivedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmountReceived(e.target.value);
    validate.amount(e.target.value);
  };

  const [receiveDate, setReceiveDate] = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [errorReceiveDate, setErrorReceiveDate] = useState<string | undefined>(undefined);
  const handleReceiveDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReceiveDate(e.target.value);
    validate.date(e.target.value);
  };

  useEffect(() => {
    const getForms = async () => {
      const response = (await new PaymentForm().get()).filter((form) => form.link == 2);
      setForms(response);
    };

    const getData = async () => {
      const data = await new ReceiveBillModel().getOne(id);
      if (data) {
        setReceiveBill(data);

        setBill(data.bill.toString());
        setDescription(data.description);
        setPayer(data.payer);
        setSource(
          data.saleOrder
            ? 'Pedido de venda ' + data.saleOrder.id
            : data.freightOrder
            ? 'Pedido de frete ' + data.freightOrder.id
            : 'INTERNO',
        );
        setDate(data.date);
        setAmount(formatarValor(data.amount));
        setDueDate(data.dueDate);
        setSituation(
          data.situation == 1
            ? 'PENDENTE'
            : data.situation == 2
            ? 'PAGO PARCIALMENTE'
            : 'PAGO',
        );
      }
    };

    const load = async () => {
      await getForms();
      await getData();
    };

    load();
  }, []);

  const validate = {
    form: (value: string) => {
      if (value == '0') {
        setErrorForm('A forma de pagamento precisa ser selecionada.');
        return false;
      } else {
        setErrorForm(undefined);
        receiveBill.paymentForm = (
          forms.find((form) => form.id == Number(value)) as PaymentForm
        ).toAttributes;
        return true;
      }
    },
    amount: (value: string) => {
      if (value.length == 0) {
        setErrorAmountReceived('O valor pago precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorAmountReceived('O valor pago preenchido é inválido.');
        return false;
      } else {
        setErrorAmountReceived(undefined);
        receiveBill.amountReceived = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    date: (value: string) => {
      const val = new Date(value + 'T12:00:00');
      const dat = new Date(receiveBill.date + 'T12:00:00');
      const now = new Date(Date.now());
      if (value.length == 0) {
        setErrorReceiveDate('A data de pagamento precisa ser preenchida.');
        return false;
      } else if (
        (now.getFullYear() == val.getFullYear() &&
          now.getMonth() == val.getMonth() &&
          now.getDate() < val.getDate()) ||
        (dat.getFullYear() == val.getFullYear() &&
          dat.getMonth() == val.getMonth() &&
          dat.getDate() > val.getDate())
      ) {
        setErrorReceiveDate('A data de recebimento preenchida é inválida.');
        return false;
      } else {
        setErrorReceiveDate(undefined);
        receiveBill.receiveDate = value;
        return true;
      }
    },
  };

  const validateFields = () => {
    return (
      validate.form(form) && validate.amount(amountReceived) && validate.date(receiveDate)
    );
  };

  const persistData = async () => {
    if (validateFields()) {
      if (await receiveBill.update()) {
        history.push(`/contas/receber`);
        window.location.reload();
      }
    }
  };

  const handleCancelClick = () => {
    history.push(`/contas/receber`);
    window.location.reload();
  };
  const handleReceiveClick = async () => {
    await persistData();
  };

  return (
    <>
      <CardTitle text="Detalhes da conta" />
      <FieldsetCard legend="Dados da conta">
        <Row>
          <FormInputText
            colSm={1}
            id="conta"
            label="Conta"
            obrigatory={false}
            value={bill}
            onChange={handleBillChange}
            readonly
          />
          <FormInputDate
            colSm={2}
            id="data"
            label="Data"
            obrigatory={false}
            value={date}
            onChange={handleDateChange}
            readonly
          />
          <FormInputText
            colSm={6}
            id="descricao"
            label="Descrição"
            obrigatory={false}
            value={description}
            onChange={handleDescriptionChange}
            readonly
          />
          <FormInputText
            colSm={3}
            id="fonte"
            label="Fonte"
            obrigatory={false}
            value={source}
            onChange={handleSourceChange}
            readonly
          />
        </Row>
        <Row>
          <FormInputText
            colSm={3}
            id="pagador"
            label="Pagador"
            obrigatory={false}
            value={payer}
            onChange={handlePayerChange}
            readonly
          />
          <FormInputDate
            colSm={2}
            id="vencimento"
            label="Vencimento"
            obrigatory={false}
            value={dueDate}
            onChange={handleDueDateChange}
            readonly
          />
          <FormInputGroupText
            colSm={3}
            id="valor"
            label="Valor"
            groupText={'R$'}
            obrigatory={false}
            mask="#.##0,00"
            maskReversal={true}
            maskPlaceholder="0,00"
            value={amount}
            onChange={handleAmountChange}
            readonly
          />
          <FormInputText
            colSm={4}
            id="situacao"
            label="Situação"
            obrigatory={false}
            value={situation}
            onChange={handleSituationChange}
            readonly
          />
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Dados do pagamento" obrigatoryFields>
        <Row>
          <FormInputSelect
            colSm={6}
            id="forma-pagamento"
            label="Forma Pagamento"
            obrigatory
            value={form}
            onChange={handleFormChange}
            message={errorForm}
          >
            <option value="0">SELECIONE</option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.description}
              </option>
            ))}
          </FormInputSelect>
          <FormInputGroupText
            colSm={3}
            id="valor-recebido"
            label="Valor recebido"
            obrigatory
            groupText={'R$'}
            mask="#.##0,00"
            maskReversal={true}
            maskPlaceholder="0,00"
            value={amountReceived}
            onChange={handleAmountReceivedChange}
            message={errorAmountReceived}
          />
          <FormInputDate
            colSm={3}
            id="data-recebimento"
            label="Data recebimento"
            obrigatory
            value={receiveDate}
            onChange={handleReceiveDateChange}
            message={errorReceiveDate}
          />
        </Row>
      </FieldsetCard>
      <Row>
        <Col sm="2">
          <Button
            id="cancelar"
            color="danger"
            style={{ width: '100%' }}
            size="sm"
            onClick={handleCancelClick}
          >
            CANCELAR
          </Button>
        </Col>
        <Col sm="8"></Col>
        <Col sm="2">
          <Button
            id="receive"
            color="success"
            style={{ width: '100%' }}
            size="sm"
            onClick={handleReceiveClick}
          >
            RECEBER
          </Button>
        </Col>
      </Row>
    </>
  );
}
