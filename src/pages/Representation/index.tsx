import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormContact } from '../../components/form-contact';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Params, useParams } from 'react-router-dom';
import { FormEnterprisePerson } from '../../components/form-enterprise-person';
import { Representation as RepresentationModel } from '../../models/Representation';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  representation: RepresentationModel;
}

class Representation extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;
  private personRef: React.RefObject<FormEnterprisePerson>;
  private contactRef: React.RefObject<FormContact>;

  constructor(props: IComponentProps) {
    super(props);

    this.personRef = createRef();
    this.contactRef = createRef();

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = { representation: new RepresentationModel() };
  }

  getData = async () => {
    const rep = await new RepresentationModel().getOne(this.id);
    if (rep) {
      this.setState({ representation: rep });
    }
  };

  async componentDidMount() {
    if (this.method != 'novo') await this.getData();
  }

  validateFields = () => {
    return (
      this.personRef.current?.validateFields() &&
      this.contactRef.current?.validateFields()
    );
  };

  clearFields = () => {
    this.personRef.current?.clearFields();
    this.contactRef.current?.clearFields();
  };

  persistData = async () => {
    const { representation } = this.state;
    if (this.validateFields()) {
      if (this.method == 'novo' || this.method == 'unidade') {
        console.log(representation);

        if (await representation.save()) this.clearFields();
      } else {
        await representation.update();
      }
    }
  };

  render() {
    const { representation } = this.state;

    const personFields = {
      modelPerson: representation.person,
      readonly: this.method == 'unidade' ? true : false,
      ref: this.personRef,
    };

    const contactFields = {
      modelContact: representation.person.contact,
      ref: this.contactRef,
    };

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Cadastrar Nova Representação'
              : this.method == 'unidade'
              ? 'Adicionar nova unidade'
              : 'Detalhes da Representação'
          }
        />
        <FieldsetCard legend="Dados pessoais da representação" obrigatoryFields>
          <FormEnterprisePerson {...personFields} />
        </FieldsetCard>
        <FieldsetCard legend="Dados de contato da representação" obrigatoryFields>
          <FormContact {...contactFields} />
        </FieldsetCard>
        <FormButtonsSave
          backLink="/representacoes"
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
  return <Representation params={useParams()} />;
};
