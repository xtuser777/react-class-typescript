import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormContact } from '../../components/form-contact';
import { FormIndividualPerson } from '../../components/form-individual-person';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Col, Row } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputText } from '../../components/form-input-text';
import { Driver as DriverModel } from '../../models/Driver';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  driver: DriverModel;
  cnh: string;
  bank: string;
  agency: string;
  account: string;
  accountDigit: string;
  type: string;
  errorCnh?: string;
  errorBank?: string;
  errorAgency?: string;
  errorAccount?: string;
  errorType?: string;
}

class Driver extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;
  private personRef: React.RefObject<FormIndividualPerson>;
  private contactRef: React.RefObject<FormContact>;

  constructor(props: IComponentProps) {
    super(props);

    this.personRef = createRef();
    this.contactRef = createRef();

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = {
      driver: new DriverModel(),
      cnh: '',
      bank: '',
      agency: '',
      account: '',
      accountDigit: '',
      type: '0',
      errorCnh: undefined,
      errorBank: undefined,
      errorAgency: undefined,
      errorAccount: undefined,
      errorType: undefined,
    };
  }

  getData = async () => {
    const driver = await new DriverModel().getOne(this.id);
    if (driver) {
      this.setState({
        driver,
        cnh: driver.cnh,
        bank: driver.bankData.bank,
        agency: driver.bankData.agency,
        account: driver.bankData.account,
        type: driver.bankData.type.toString(),
      });
    }
  };

  async componentDidMount() {
    if (this.method == 'editar') await this.getData();
  }

  validate = {
    cnh: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorCnh: 'A CNH do motorista precisa ser preenchida.' });
        return false;
      } else {
        this.setState({ errorCnh: undefined });
        this.state.driver.cnh = value;
        return true;
      }
    },
    bank: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorBank: 'O número do banco precisa ser preenchido.' });
        return false;
      } else {
        this.setState({ errorBank: undefined });
        this.state.driver.bankData.bank = value;
        return true;
      }
    },
    agency: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorAgency: 'A agência do banco precisa ser preenchida.' });
        return false;
      } else {
        this.setState({ errorAgency: undefined });
        this.state.driver.bankData.agency = value;
        return true;
      }
    },
    account: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorAccount: 'A conta do banco precisa ser preenchida.' });
        return false;
      } else {
        this.setState({ errorAccount: undefined });
        this.state.driver.bankData.account = value;
        return true;
      }
    },
    type: (value: string) => {
      if (value == '0') {
        this.setState({ errorType: 'O tipo de conta precisa ser selecionado.' });
        return false;
      } else {
        this.setState({ errorType: undefined });
        this.state.driver.bankData.type = Number(value);
        return true;
      }
    },
  };

  validateFields = async () => {
    const { cnh, bank, agency, account, type } = this.state;
    return (
      (await this.personRef.current?.validateFields()) &&
      this.validate.cnh(cnh) &&
      this.validate.bank(bank) &&
      this.validate.agency(agency) &&
      this.validate.account(account) &&
      this.validate.type(type) &&
      this.contactRef.current?.validateFields()
    );
  };

  clearFields = () => {
    this.setState({
      driver: new DriverModel(),
      cnh: '',
      bank: '',
      agency: '',
      account: '',
      accountDigit: '',
      type: '0',
    });
    this.personRef.current?.clearFields();
    this.contactRef.current?.clearFields();
  };

  persistData = async () => {
    const { driver } = this.state;
    if (await this.validateFields()) {
      if (this.method == 'novo') {
        if (await driver.save()) this.clearFields();
      } else await driver.update();
    }
  };

  render() {
    const {
      driver,
      cnh,
      bank,
      agency,
      account,
      accountDigit,
      type,
      errorCnh,
      errorBank,
      errorAgency,
      errorAccount,
      errorType,
    } = this.state;

    const personFields = {
      modelPerson: driver.person,
      ref: this.personRef,
    };

    const contactFields = {
      modelContact: driver.person.contact,
      ref: this.contactRef,
    };

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo' ? 'Cadastrar Novo Motorista' : 'Detalhes do Motorista'
          }
        />
        <FieldsetCard legend="Dados pessoais do Motorista" obrigatoryFields>
          <FormIndividualPerson {...personFields} />
        </FieldsetCard>
        <Row>
          <Col sm="4">
            <FieldsetCard legend="Dados do Motorista" obrigatoryFields>
              <Row>
                <FormInputText
                  colSm={12}
                  id="cnh"
                  label="CNH"
                  obrigatory
                  value={cnh}
                  mask="00000000000"
                  onChange={(e) => {
                    this.setState({ cnh: e.target.value });
                    this.validate.cnh(e.target.value);
                  }}
                  message={errorCnh}
                />
              </Row>
            </FieldsetCard>
          </Col>
          <Col sm="8">
            <FieldsetCard legend="Dados bancários do Motorista" obrigatoryFields>
              <Row>
                <FormInputText
                  colSm={2}
                  id="bank"
                  label="Banco"
                  obrigatory
                  mask="000"
                  value={bank}
                  onChange={(e) => {
                    this.setState({ bank: e.target.value });
                    this.validate.bank(e.target.value);
                  }}
                  message={errorBank}
                />
                <FormInputText
                  colSm={2}
                  id="agencia"
                  label="Agência"
                  obrigatory
                  mask="0000-0"
                  value={agency}
                  onChange={(e) => {
                    this.setState({ agency: e.target.value });
                    this.validate.agency(e.target.value);
                  }}
                  message={errorAgency}
                />
                <FormInputText
                  colSm={3}
                  id="conta"
                  label="Conta"
                  obrigatory
                  mask="0000000000"
                  value={account}
                  onChange={(e) => {
                    this.setState({ account: e.target.value });
                    this.validate.account(e.target.value);
                  }}
                  message={errorAccount}
                />
                <FormInputText
                  colSm={1}
                  id="conta-digito"
                  label={<span>&nbsp;</span>}
                  obrigatory={false}
                  mask="0"
                  value={accountDigit}
                  onChange={(e) => {
                    this.setState({ accountDigit: e.target.value });
                    driver.bankData.account += e.target.value;
                  }}
                />
                <FormInputSelect
                  colSm={4}
                  id="tipo"
                  label="Tipo de Conta"
                  obrigatory
                  value={type}
                  onChange={(e) => {
                    this.setState({ type: e.target.value });
                    this.validate.type(e.target.value);
                  }}
                  message={errorType}
                >
                  <option value="0">SELECIONE</option>
                  <option value="1">Corrente</option>
                  <option value="2">Poupança</option>
                </FormInputSelect>
              </Row>
            </FieldsetCard>
          </Col>
        </Row>
        <FieldsetCard legend="Dados de contato do Motorista" obrigatoryFields>
          <FormContact {...contactFields} />
        </FieldsetCard>
        <FormButtonsSave
          backLink="/motoristas"
          clear={this.method == 'novo' ? true : false}
          save
          clearFields={this.clearFields}
          persistData={this.persistData}
        />
      </>
    );
  }
}

export default () => {
  return <Driver params={useParams()} />;
};
