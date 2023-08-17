import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormContact } from '../../components/form-contact';
import { FormIndividualPerson } from '../../components/form-individual-person';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Row } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputSelect } from '../../components/form-input-select';
import { FormEnterprisePerson } from '../../components/form-enterprise-person';
import { Proprietary as ProprietaryModel } from '../../models/Proprietary';
import { IndividualPerson } from '../../models/IndividualPerson';
import { Driver, IDriver } from '../../models/Driver';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  proprietary: ProprietaryModel;
  drivers: IDriver[];
  driver: string;
  type: string;
  errorType?: string;
}

class Proprietary extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;
  private individualPersonRef: React.RefObject<FormIndividualPerson>;
  private enterprisePersonRef: React.RefObject<FormEnterprisePerson>;
  private contactRef: React.RefObject<FormContact>;

  constructor(props: IComponentProps) {
    super(props);

    this.individualPersonRef = createRef();
    this.enterprisePersonRef = createRef();
    this.contactRef = createRef();

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = {
      proprietary: new ProprietaryModel(),
      drivers: [],
      driver: '0',
      type: '1',
      errorType: undefined,
    };
  }

  getDrivers = async () => {
    const data = await new Driver().get();
    this.setState({ drivers: data });
  };

  getData = async () => {
    const prop = await new ProprietaryModel().getOne(this.id);
    if (prop) {
      this.setState({
        proprietary: prop,
        driver: prop.driver ? prop.driver.id.toString() : '0',
        type: prop.person.type.toString(),
      });
    }
  };

  async componentDidMount() {
    await this.getDrivers();
    if (this.method == 'editar') await this.getData();
  }

  validate = {
    type: (value: string) => {
      if (value == '0') {
        this.setState({ errorType: 'O tipo do pessoa precisa ser selecionado.' });
        return false;
      } else {
        this.setState({ errorType: undefined });
        this.state.proprietary.person.type = Number(value);
        return true;
      }
    },
  };

  validateFields = async () => {
    const { type } = this.state;
    return (
      (type == '1'
        ? await this.individualPersonRef.current?.validateFields()
        : this.enterprisePersonRef.current?.validateFields()) &&
      this.validate.type(type) &&
      this.contactRef.current?.validateFields()
    );
  };

  clearFields = () => {
    this.setState({ proprietary: new ProprietaryModel(), type: '1' });
    this.individualPersonRef.current?.clearFields();
    this.enterprisePersonRef.current?.clearFields();
    this.contactRef.current?.clearFields();
  };

  persistData = async () => {
    const { proprietary } = this.state;
    if (await this.validateFields()) {
      if (this.method == 'novo') {
        if (await proprietary.save()) this.clearFields();
      } else await proprietary.update();
    }
  };

  render(): React.ReactNode {
    const { proprietary, drivers, driver, type } = this.state;
    const personIndividualFields = {
      modelPerson: proprietary.person,
      readonly: driver != '0' ? true : false,
      ref: this.individualPersonRef,
    };

    const personEnterpriseFields = {
      modelPerson: proprietary.person,
      ref: this.enterprisePersonRef,
    };

    const contactFields = {
      modelContact: proprietary.person.contact,
      readonly: driver != '0' ? true : false,
      ref: this.contactRef,
    };

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Cadastrar Proprietário de Caminhão'
              : 'Detalhes do Proprietário de Caminhão'
          }
        />
        <FieldsetCard legend="Vínculos" obrigatoryFields>
          <Row>
            <FormInputSelect
              colSm={6}
              id="driver"
              label="Motorista"
              obrigatory
              value={driver}
              onChange={(e) => {
                this.setState({ driver: e.target.value });
                if (e.target.value != '0') {
                  const drv = drivers.find(
                    (item) => item.id == Number.parseInt(e.target.value),
                  ) as Driver;
                  proprietary.driver = drv.toAttributes;
                  this.setState({ type: drv.person.type.toString() });
                  this.individualPersonRef.current?.setState({
                    name: (drv.person.individual as IndividualPerson).name,
                    cpf: (drv.person.individual as IndividualPerson).cpf,
                    birth: (drv.person.individual as IndividualPerson).birth,
                  });
                  this.contactRef.current?.setState({
                    street: drv.person.contact.address.street,
                    number: drv.person.contact.address.number,
                    neighborhood: drv.person.contact.address.neighborhood,
                    complement: drv.person.contact.address.complement,
                    code: drv.person.contact.address.code,
                    state: drv.person.contact.address.city.state.id.toString(),
                    cities:
                      this.contactRef.current.state.states[
                        drv.person.contact.address.city.state.id - 1
                      ].cities,
                    city: drv.person.contact.address.city.id.toString(),
                    phone: drv.person.contact.phone,
                    cellphone: drv.person.contact.cellphone,
                    email: drv.person.contact.email,
                  });
                } else {
                  this.clearFields();
                }
              }}
              disable={this.method == 'editar' ? true : false}
            >
              <option value="0">SELECIONE</option>
              {drivers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.person.individual?.name}
                </option>
              ))}
            </FormInputSelect>
            <FormInputSelect
              colSm={6}
              id="tipo"
              label="Tipo do Cliente"
              obrigatory
              value={type}
              onChange={(e) => {
                this.setState({ type: e.target.value });
                this.validate.type(e.target.value);
              }}
              disable={this.method == 'editar' || driver != '0' ? true : false}
            >
              <option value="1">PESSOA FÍSICA</option>
              <option value="2">PESSOA JURÍDICA</option>
            </FormInputSelect>
          </Row>
        </FieldsetCard>
        <FieldsetCard
          legend="Dados pessoais do Proprietário de Caminhão"
          obrigatoryFields
        >
          {type == '1' ? (
            <FormIndividualPerson {...personIndividualFields} />
          ) : (
            <FormEnterprisePerson {...personEnterpriseFields} />
          )}
        </FieldsetCard>
        <FieldsetCard
          legend="Dados de contato do Proprietário de Caminhão"
          obrigatoryFields
        >
          <FormContact {...contactFields} />
        </FieldsetCard>
        <FormButtonsSave
          backLink="/proprietarios"
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
  return <Proprietary params={useParams()} />;
};
