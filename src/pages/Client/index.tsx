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
import { Client as ClientModel } from '../../models/Client';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  client: ClientModel;
  type: string;
  errorType?: string;
}

class Client extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;
  private individualPersonRef: React.RefObject<FormIndividualPerson>;
  private enterprisePersonRef: React.RefObject<FormEnterprisePerson>;
  private contactRef: React.RefObject<FormContact>;

  constructor(props: IComponentProps) {
    super(props);

    this.individualPersonRef = createRef<FormIndividualPerson>();
    this.enterprisePersonRef = createRef<FormEnterprisePerson>();
    this.contactRef = createRef<FormContact>();

    this.method = this.props.params.method as string;
    this.id = 0;
    if (this.props.params.id) this.id = Number.parseInt(this.props.params.id);

    this.state = {
      client: new ClientModel(),
      type: '1',
      errorType: undefined,
    };
  }

  getData = async () => {
    const client = await new ClientModel().getOne(this.id);
    if (client) {
      this.setState({
        client,
        type: client.person.type.toString(),
      });
    }
  };

  async componentDidMount() {
    if (this.method == 'editar') await this.getData();
  }

  validate = {
    type: (value: string) => {
      if (value == '0') {
        this.setState({ errorType: 'O tipo do cliente precisa ser selecionado.' });
        return false;
      } else {
        this.setState({ errorType: undefined });
        this.state.client.person.type = Number(value);
        return true;
      }
    },
  };

  validateFields = async () => {
    return (
      (this.state.type == '1'
        ? this.individualPersonRef.current?.validateFields()
        : this.enterprisePersonRef.current?.validateFields()) &&
      this.validate.type(this.state.type) &&
      this.contactRef.current?.validateFields()
    );
  };

  clearFields = () => {
    this.setState({
      client: new ClientModel(),
      type: '1',
    });
    this.individualPersonRef.current?.clearFields();
    this.enterprisePersonRef.current?.clearFields();
    this.contactRef.current?.clearFields();
  };

  persistData = async () => {
    if (await this.validateFields()) {
      if (this.method == 'novo') {
        if (await this.state.client.save()) this.clearFields();
      } else await this.state.client.update();
    }
  };

  render(): React.ReactNode {
    const personIndividualFields = {
      modelPerson: this.state.client.person,
      ref: this.individualPersonRef,
    };

    const personEnterpriseFields = {
      modelPerson: this.state.client.person,
      ref: this.enterprisePersonRef,
    };

    const contactFields = {
      modelContact: this.state.client.person.contact,
      ref: this.contactRef,
    };

    return (
      <>
        <CardTitle
          text={this.method == 'novo' ? 'Cadastrar Novo Cliente' : 'Detalhes do Cliente'}
        />
        <FieldsetCard legend="Tipo Cliente" obrigatoryFields>
          <Row>
            <FormInputSelect
              colSm={12}
              id="tipo"
              label="Tipo do Cliente"
              obrigatory
              value={this.state.type}
              message={this.state.errorType}
              onChange={(e) => {
                this.setState({ type: e.target.value });
                this.validate.type(e.target.value);
              }}
              disable={this.method == 'editar' ? true : false}
            >
              <option value="1">PESSOA FÍSICA</option>
              <option value="2">PESSOA JURÍDICA</option>
            </FormInputSelect>
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Dados pessoais do cliente" obrigatoryFields>
          {this.state.type == '1' ? (
            <FormIndividualPerson {...personIndividualFields} />
          ) : (
            <FormEnterprisePerson {...personEnterpriseFields} />
          )}
        </FieldsetCard>
        <FieldsetCard legend="Dados de contato do cliente" obrigatoryFields>
          <FormContact {...contactFields} />
        </FieldsetCard>
        <FormButtonsSave
          backLink="/clientes"
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
  return <Client params={useParams()} />;
};
