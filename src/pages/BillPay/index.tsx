import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Button, Col, Row } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputSelect } from '../../components/form-input-select';
import { useParams } from 'react-router-dom';
import { BillPay as BillPayModel } from '../../models/BillPay';
import { IPaymentForm, PaymentForm } from '../../models/PaymentForm';
import { formatarValor } from '../../utils/format';
import history from '../../services/history';

export function BillPay(): JSX.Element {
  const [billPay, setBillPay] = useState(new BillPayModel());
  const [forms, setForms] = useState(new Array<IPaymentForm>());

  const routeParams = useParams();
  let id = 0;
  if (routeParams.id) id = Number.parseInt(routeParams.id);

  useEffect(() => {
    const getForms = async () => {
      const response = (await new PaymentForm().get()).filter((form) => form.link == 1);
      setForms(response);
    };

    const getData = async () => {
      const data = await new BillPayModel().getOne(id);
      if (data) {
        setBillPay(data);

        setBill(data.bill.toString());
        setType(data.type == 1 ? 'A VISTA' : data.type == 2 ? 'A PRAZO' : 'FIXA');
        setDescription(data.description);
        setEnterprise(data.enterprise);
        setSource(
          data.saleOrder
            ? 'Pedido de venda ' + data.saleOrder.id
            : data.freightOrder
            ? 'Pedido de frete ' + data.freightOrder.id
            : 'INTERNO',
        );
        setInstallment(data.installment.toString());
        setDate(data.date);
        setAmount(formatarValor(data.amount));
        setDueDate(data.dueDate);
        setCategory(data.category.description);
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
        billPay.paymentForm = (
          forms.find((form) => form.id == Number(value)) as PaymentForm
        ).toAttributes;
        return true;
      }
    },
    amount: (value: string) => {
      if (value.length == 0) {
        setErrorAmountPaid('O valor pago precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorAmountPaid('O valor pago preenchido é inválido.');
        return false;
      } else {
        setErrorAmountPaid(undefined);
        billPay.amountPaid = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    date: (value: string) => {
      const val = new Date(value + 'T12:00:00');
      const dat = new Date(billPay.date + 'T12:00:00');
      const now = new Date(Date.now());
      if (value.length == 0) {
        setErrorPaymentDate('A data de pagamento precisa ser preenchida.');
        return false;
      } else if (
        (now.getFullYear() == val.getFullYear() &&
          now.getMonth() == val.getMonth() &&
          now.getDate() < val.getDate()) ||
        (dat.getFullYear() == val.getFullYear() &&
          dat.getMonth() == val.getMonth() &&
          dat.getDate() > val.getDate())
      ) {
        setErrorPaymentDate('A data de pagamento preenchida é inválida.');
        return false;
      } else {
        setErrorPaymentDate(undefined);
        billPay.paymentDate = value;
        return true;
      }
    },
  };

  const [bill, setBill] = useState('');
  const handleBillChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBill(e.target.value);
  };

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const [installment, setInstallment] = useState('');
  const handleInstallmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInstallment(e.target.value);
  };

  const [description, setDescription] = useState('');
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const [enterprise, setEnterprise] = useState('');
  const handleEnterpriseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnterprise(e.target.value);
  };

  const [type, setType] = useState('');
  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const [category, setCategory] = useState('');
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const [source, setSource] = useState('');
  const handleSourceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
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

  const [amountPaid, setAmountPaid] = useState('');
  const [errorAmountPaid, setErrorAmountPaid] = useState<string | undefined>(undefined);
  const handleAmountPaidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmountPaid(e.target.value);
    validate.amount(e.target.value);
  };

  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [errorPaymentDate, setErrorPaymentDate] = useState<string | undefined>(undefined);
  const handlePaymentDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentDate(e.target.value);
    validate.date(e.target.value);
  };

  const validateFields = () => {
    return (
      validate.form(form) && validate.amount(amountPaid) && validate.date(paymentDate)
    );
  };

  const persistData = async () => {
    if (validateFields()) {
      if (await billPay.update()) {
        history.push(`/contas/pagar`);
        window.location.reload();
      }
    }
  };

  const handleCancelClick = () => {
    history.push(`/contas/pagar`);
    window.location.reload();
  };
  const handlePayOffClick = async () => {
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
            colSm={1}
            id="parcela"
            label="Parcela"
            obrigatory={false}
            value={installment}
            onChange={handleInstallmentChange}
            readonly
          />
          <FormInputText
            colSm={8}
            id="descricao"
            label="Descrição"
            obrigatory={false}
            value={description}
            onChange={handleDescriptionChange}
            readonly
          />
        </Row>
        <Row>
          <FormInputText
            colSm={4}
            id="empresa"
            label="Empresa"
            obrigatory={false}
            value={enterprise}
            onChange={handleEnterpriseChange}
            readonly
          />
          <FormInputText
            colSm={2}
            id="tipo"
            label="Tipo"
            obrigatory={false}
            value={type}
            onChange={handleTypeChange}
            readonly
          />
          <FormInputText
            colSm={3}
            id="categoria"
            label="Categoria"
            obrigatory={false}
            value={category}
            onChange={handleCategoryChange}
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
          <FormInputDate
            colSm={3}
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
            label="Valor despesa"
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
            colSm={6}
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
            id="valor-pago"
            label="Valor pago"
            obrigatory
            groupText={'R$'}
            mask="#.##0,00"
            maskReversal={true}
            maskPlaceholder="0,00"
            value={amountPaid}
            onChange={handleAmountPaidChange}
            message={errorAmountPaid}
          />
          <FormInputDate
            colSm={3}
            id="data-pagamento"
            label="Data pagamento"
            obrigatory
            value={paymentDate}
            onChange={handlePaymentDateChange}
            message={errorPaymentDate}
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
            id="quitar"
            color="success"
            style={{ width: '100%' }}
            size="sm"
            onClick={handlePayOffClick}
          >
            QUITAR
          </Button>
        </Col>
      </Row>
    </>
  );
}
