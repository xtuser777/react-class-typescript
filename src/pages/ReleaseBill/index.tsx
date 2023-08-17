import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Button, Col, Row } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputNumber } from '../../components/form-input-number';
import { FormInputDate } from '../../components/form-input-date';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { BillPay as BillPayModel } from '../../models/BillPay';
import { IPaymentForm, PaymentForm } from '../../models/PaymentForm';
import history from '../../services/history';
import { BillPayCategory, IBillPayCategory } from '../../models/BillPayCategory';
import { FreightOrder, IFreightOrder } from '../../models/FreightOrder';

export function ReleaseBill(): JSX.Element {
  const [billPay, setBillPay] = useState(new BillPayModel());
  const [forms, setForms] = useState(new Array<IPaymentForm>());
  const [categories, setCategories] = useState(new Array<IBillPayCategory>());
  const [freightOrders, setFreightOrders] = useState(new Array<IFreightOrder>());

  const [enterprise, setEnterprise] = useState('');
  const [errorEnterprise, setErrorEnterprise] = useState<string | undefined>(undefined);
  const handleEntrepriseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnterprise(e.target.value);
    validate.enterprise(e.target.value);
  };

  const [category, setCategory] = useState('0');
  const [errorCategory, setErrorCategory] = useState<string | undefined>(undefined);
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
    validate.category(e.target.value);
  };

  const [freightOrder, setFreightOrder] = useState('0');
  const [errorFreightOrder, setErrorFreightOrder] = useState<string | undefined>(
    undefined,
  );
  const handleFreightOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFreightOrder(e.target.value);
    if (e.target.value != '0') {
      setErrorFreightOrder(undefined);
      billPay.freightOrder = (
        freightOrders.find((order) => order.id == Number(e.target.value)) as FreightOrder
      ).toAttributes;
    } else {
      if (category == '250') setErrorFreightOrder('Selecione o pedido de frete.');
      else setErrorFreightOrder(undefined);
      billPay.freightOrder = undefined;
    }
  };

  const [bill, setBill] = useState('');
  const [errorBill, setErrorBill] = useState<string | undefined>(undefined);
  const handleBillChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBill(e.target.value);
    validate.bill(e.target.value);
  };

  const [description, setDescription] = useState('');
  const [errorDescription, setErrorDescription] = useState<string | undefined>(undefined);
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    validate.description(e.target.value);
  };

  const [type, setType] = useState('0');
  const [errorType, setErrorType] = useState<string | undefined>(undefined);
  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
    validate.type(e.target.value);
  };

  const [form, setForm] = useState('0');
  const [errorForm, setErrorForm] = useState<string | undefined>(undefined);
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(e.target.value);
    if (e.target.value != '0') {
      setErrorForm(undefined);
      billPay.paymentForm = (
        forms.find((form) => form.id == Number(e.target.value)) as PaymentForm
      ).toAttributes;
    } else {
      if (type == '1')
        setErrorForm('A forma de pagamento do valor a vista precisa ser preenchido.');
      setAmountPaid('');
      billPay.paymentForm = undefined;
    }
  };

  const [interval, setInterval] = useState(1);
  const [errorInterval, setErrorInterval] = useState<string | undefined>(undefined);
  const handleIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInterval(Number.parseInt(e.target.value));
    validate.interval(e.target.value);
  };

  const [frequency, setFrequency] = useState('0');
  const [errorFrequency, setErrorFrequency] = useState<string | undefined>(undefined);
  const handleFrequencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFrequency(e.target.value);
    if (type == '3') {
      if (e.target.value == '0') {
        setErrorFrequency('A frequência da conta fixa precisa ser selecionada.');
        setInstallments(1);
        setInterval(1);
      } else {
        setErrorFrequency(undefined);
        if (e.target.value == '1') {
          setInstallments(12);
          setInterval(30);
        } else {
          setInstallments(2);
          setInterval(365);
        }
      }
      setAmountPaid('');
      billPay.amountPaid = 0.0;
    }
  };

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [errorDate, setErrorDate] = useState<string | undefined>(undefined);
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    validate.date(e.target.value);
  };

  const [amountPaid, setAmountPaid] = useState('');
  const [errorAmountPaid, setErrorAmountPaid] = useState<string | undefined>(undefined);
  const handleAmountPaidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmountPaid(e.target.value);
    if (e.target.value != '0') {
      setErrorAmountPaid(undefined);
      billPay.amountPaid = Number.parseFloat(
        e.target.value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
      );
    } else {
      if (form != '0')
        setErrorAmountPaid('O valor pago na conta a vista precisa ser preenchido.');
      else setErrorAmountPaid(undefined);
      billPay.amountPaid = 0.0;
    }
  };

  const [installments, setInstallments] = useState(1);
  const [errorInstallments, setErrorInstallments] = useState<string | undefined>(
    undefined,
  );
  const handleInstallmentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInstallments(Number.parseInt(e.target.value));
    validate.installments(e.target.value);
  };

  const [amount, setAmount] = useState('');
  const [errorAmount, setErrorAmount] = useState<string | undefined>(undefined);
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    validate.amount(e.target.value);
  };

  const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));
  const [errorDueDate, setErrorDueDate] = useState<string | undefined>(undefined);
  const handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
    validate.dueDate(e.target.value);
  };

  useEffect(() => {
    const getForms = async () => {
      const response = (await new PaymentForm().get()).filter((form) => form.link == 1);
      setForms(response);
    };

    const getOrders = async () => {
      const freightOrders = await new FreightOrder().get();
      setFreightOrders(freightOrders);
    };

    const getCategories = async () => {
      const categories = await new BillPayCategory().get();
      setCategories(categories);
    };

    const getBill = async () => {
      const bills = await new BillPayModel().get();
      setBill(
        bills.length > 0 ? ((bills.pop() as BillPayModel).bill + 1).toString() : '1',
      );
    };

    const load = async () => {
      await getForms();
      await getOrders();
      await getCategories();
      await getBill();
      setBillPay(new BillPayModel());
    };

    load();
  }, []);

  const validate = {
    enterprise: (value: string) => {
      if (value.length == 0) {
        setErrorEnterprise('A empresa recebedora precisa ser preenchida.');
        return false;
      } else if (value.length < 2) {
        setErrorEnterprise('A empresa recebedora preenchida é inválida.');
        return false;
      } else {
        setErrorEnterprise(undefined);
        billPay.enterprise = value;
        return true;
      }
    },
    category: (value: string) => {
      if (value == '0') {
        setErrorCategory('A categoria da conta precisa ser selecionada.');
        setFreightOrder('0');
        setErrorFreightOrder(undefined);
        return false;
      } else {
        setErrorCategory(undefined);
        if (value != '250') {
          setFreightOrder('0');
          setErrorFreightOrder(undefined);
        }
        billPay.category = (
          categories.find((category) => category.id == Number(value)) as BillPayCategory
        ).toAttributes;
        return true;
      }
    },
    bill: (value: string) => {
      if (Number(value) <= 0) {
        setErrorBill('O número da conta é inválido.');
        return false;
      } else {
        setErrorBill(undefined);
        billPay.bill = Number(value);
        return true;
      }
    },
    description: (value: string) => {
      if (value.length == 0) {
        setErrorDescription('A descrição precisa ser preenchida.');
        return false;
      } else if (value.length < 2) {
        setErrorDescription('A descrição preenchida é inválida.');
        return false;
      } else {
        setErrorDescription(undefined);
        billPay.description = value;
        return true;
      }
    },
    date: (value: string) => {
      const val = new Date(value + 'T12:00:00');
      const now = new Date(Date.now());
      if (value.length == 0) {
        setErrorDate('A data precisa ser preenchida.');
        return false;
      } else if (
        now.getFullYear() == val.getFullYear() &&
        now.getMonth() == val.getMonth() &&
        now.getDate() < val.getDate()
      ) {
        setErrorDate('A data preenchida é inválida.');
        return false;
      } else {
        setErrorDate(undefined);
        billPay.date = value;
        return true;
      }
    },
    type: (value: string) => {
      if (value == '0') {
        setErrorType('O tipo da conta precisa ser selecionado.');
        setAmountPaid('');
        billPay.amountPaid = 0.0;
        return false;
      } else {
        setInstallments(1);
        setErrorInstallments(undefined);
        setInterval(1);
        setErrorInterval(undefined);
        setFrequency('0');
        setErrorFrequency(undefined);
        if (value == '2' || value == '3') {
          setForm('0');
          setErrorForm(undefined);
          setAmountPaid('');
          setErrorAmountPaid(undefined);
        }
        setErrorType(undefined);
        setAmountPaid('');
        billPay.amountPaid = 0.0;
        billPay.type = Number(value);
        return true;
      }
    },
    installments: (value: string) => {
      if (Number(value) <= 0) {
        setErrorInstallments('O número de parcelas é inválido.');
        return false;
      } else {
        setErrorInstallments(undefined);
        return true;
      }
    },
    interval: (value: string) => {
      if (Number(value) <= 0) {
        setErrorInterval('O intervalo entre parcelas é inválido.');
        return false;
      } else {
        setErrorInterval(undefined);
        return true;
      }
    },
    amount: (value: string) => {
      if (value.length == 0) {
        setErrorAmount('O preço precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorAmount('O preço informado é inválido.');
        return false;
      } else {
        setErrorAmount(undefined);
        billPay.amount = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    dueDate: (value: string) => {
      const val = new Date(value + 'T12:00:00');
      const now = new Date(Date.now());
      if (value.length == 0) {
        setErrorDueDate('A data de validade precisa ser preenchida');
        return false;
      } else if (
        now.getFullYear() == val.getFullYear() &&
        now.getMonth() == val.getMonth() &&
        now.getDate() > val.getDate()
      ) {
        setErrorDueDate('A data de validade preenchida é inválida');
        return false;
      } else {
        setErrorDueDate(undefined);
        billPay.dueDate = value;
        return true;
      }
    },
  };

  const clearFields = () => {
    setEnterprise('');
    setCategory('0');
    setFreightOrder('0');
    setBill('');
    setDescription('');
    setDate('');
    setType('0');
    setFrequency('0');
    setForm('0');
    setAmountPaid('');
    setInstallments(1);
    setInterval(1);
    setAmount('');
    setDueDate('');
  };

  const validateFields = () => {
    return (
      validate.enterprise(enterprise) &&
      validate.category(category) &&
      validate.bill(bill) &&
      validate.description(description) &&
      validate.date(date) &&
      validate.type(type) &&
      validate.installments(installments.toString()) &&
      validate.interval(interval.toString()) &&
      validate.amount(amount) &&
      validate.dueDate(dueDate)
    );
  };

  const persistData = async () => {
    if (validateFields()) {
      if (await billPay.save(Number(installments), Number(interval), Number(frequency))) {
        clearFields();
        setErrorFrequency(undefined);
      }
    }
  };

  const handleCancelClick = () => {
    history.push(`/lancar/despesas`);
    window.location.reload();
  };

  const handleClearClick = () => {
    clearFields();
  };

  const handleSaveClick = async () => {
    await persistData();
  };

  return (
    <>
      <CardTitle text="Lançar Nova Despesa" />
      <FieldsetCard legend="Fonte da despesa" obrigatoryFields>
        <Row>
          <FormInputText
            colSm={6}
            id="empresa"
            label="Empresa"
            obrigatory
            value={enterprise}
            onChange={handleEntrepriseChange}
            message={errorEnterprise}
          />
          <FormInputSelect
            colSm={2}
            id="categoria"
            label="Categoria"
            obrigatory
            value={category}
            onChange={handleCategoryChange}
            message={errorCategory}
          >
            <option value="0">SELECIONE</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.description}
              </option>
            ))}
          </FormInputSelect>
          <FormInputSelect
            colSm={4}
            id="pedido-frete"
            label="Pedido de Frete"
            obrigatory={false}
            value={freightOrder}
            onChange={handleFreightOrderChange}
            disable={category != '250'}
            message={errorFreightOrder}
          >
            <option value="0">SELECIONE</option>
            {freightOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.description}
              </option>
            ))}
          </FormInputSelect>
        </Row>
      </FieldsetCard>
      <FieldsetCard legend="Dados da despesa" obrigatoryFields>
        <Row>
          <FormInputText
            colSm={1}
            id="conta"
            label="Conta"
            obrigatory
            value={bill}
            onChange={handleBillChange}
            readonly
            message={errorBill}
          />
          <FormInputText
            colSm={5}
            id="descricao"
            label="Descrição"
            obrigatory
            value={description}
            onChange={handleDescriptionChange}
            message={errorDescription}
          />
          <FormInputDate
            colSm={2}
            id="data-despesa"
            label="Data despesa"
            obrigatory
            value={date}
            onChange={handleDateChange}
            message={errorDate}
          />
          <FormInputSelect
            colSm={2}
            id="tipo"
            label="Tipo"
            obrigatory
            value={type}
            onChange={handleTypeChange}
            message={errorType}
          >
            <option value="0">SELECIONE</option>
            <option value="1">A VISTA</option>
            <option value="2">A PRAZO</option>
            <option value="3">FIXA</option>
          </FormInputSelect>
          <FormInputSelect
            colSm={2}
            id="frequencia"
            label="Frequencia"
            obrigatory={false}
            value={frequency}
            onChange={handleFrequencyChange}
            disable={type != '3'}
            message={errorFrequency}
          >
            <option value="0">SELECIONE</option>
            <option value="1">MENSAL</option>
            <option value="2">ANUAL</option>
          </FormInputSelect>
        </Row>
        <Row>
          <FormInputSelect
            colSm={3}
            id="forma-pagamento"
            label="Forma de Pagamento"
            obrigatory={false}
            value={form}
            onChange={handleFormChange}
            disable={type != '1'}
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
            colSm={2}
            id="valor-pago"
            label="Valor pago"
            groupText={'R$'}
            obrigatory={false}
            mask="#.##0,00"
            maskReversal={true}
            maskPlaceholder="0,00"
            value={amountPaid}
            onChange={handleAmountPaidChange}
            readonly={form == '0'}
            message={errorAmountPaid}
          />
          <FormInputNumber
            colSm={1}
            id="parcelas"
            label="Parcelas"
            obrigatory
            value={installments}
            onChange={handleInstallmentsChange}
            readonly={type != '2'}
            message={errorInstallments}
          />
          <FormInputNumber
            colSm={2}
            id="intervalo"
            label="Intervalo entre parcelas"
            obrigatory
            value={interval}
            onChange={handleIntervalChange}
            readonly={type != '2'}
            message={errorInterval}
          />
          <FormInputGroupText
            colSm={2}
            id="valor"
            label="Valor Despesa"
            groupText={'R$'}
            obrigatory
            mask="#.##0,00"
            maskReversal={true}
            maskPlaceholder="0,00"
            value={amount}
            onChange={handleAmountChange}
            message={errorAmount}
          />
          <FormInputDate
            colSm={2}
            id="vencimento"
            label="Vencimento"
            obrigatory
            value={dueDate}
            onChange={handleDueDateChange}
            message={errorDueDate}
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
        <Col sm="6"></Col>
        <Col sm="2">
          <Button
            id="limpar"
            color="primary"
            style={{ width: '100%' }}
            size="sm"
            onClick={handleClearClick}
          >
            LIMPAR
          </Button>
        </Col>
        <Col sm="2">
          <Button
            id="salvar"
            color="success"
            style={{ width: '100%' }}
            size="sm"
            onClick={handleSaveClick}
          >
            SALVAR
          </Button>
        </Col>
      </Row>
    </>
  );
}
