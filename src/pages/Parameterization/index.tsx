import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { Row } from 'reactstrap';
import { FormContact } from '../../components/form-contact';
import { FormEnterprisePerson } from '../../components/form-enterprise-person';
import { FormInputFile } from '../../components/form-input-file';
import { Parameterization as ParameterizationModel } from '../../models/Parameterization';
import { FormButtonsSave } from '../../components/form-buttons-save';

interface ParameterizationState {
  parameterization: ParameterizationModel;
  method: number;
  logotype: File;
}

export class Parameterization extends Component<unknown, ParameterizationState> {
  private fetchedData: boolean;
  private personRef: React.RefObject<FormEnterprisePerson>;
  private contactRef: React.RefObject<FormContact>;

  constructor(props: unknown) {
    super(props);

    this.fetchedData = false;

    this.contactRef = createRef<FormContact>();
    this.personRef = createRef<FormEnterprisePerson>();

    this.state = {
      parameterization: new ParameterizationModel(),
      method: 1,
      logotype: new File([], ''),
    };
  }

  loadState = (data: ParameterizationModel) => {
    this.setState({
      parameterization: data,
      method: 2,
    });
  };

  loadData = async () => {
    const data = await new ParameterizationModel().get();
    if (data) {
      this.loadState(data);
    }
  };

  loadPage = async () => {
    await this.loadData();
  };

  componentDidMount(): void {
    if (this.fetchedData) return;
    this.loadPage();
    this.fetchedData = true;
  }

  validateFields = () => {
    return (
      this.personRef.current?.validateFields() &&
      this.contactRef.current?.validateFields()
    );
  };

  persistData = async () => {
    if (this.validateFields()) {
      const { parameterization, method } = this.state;
      if (method == 1) {
        await parameterization.save();
      } else {
        await parameterization.update();
      }
    }
  };

  handleSaveClick = async () => {
    await this.persistData();
  };

  render(): React.ReactNode {
    const { parameterization } = this.state;

    const personParams = {
      modelPerson: parameterization.person,
      ref: this.personRef,
    };

    const contactParams = {
      modelContact: parameterization.person.contact,
      ref: this.contactRef,
    };

    return (
      <>
        <CardTitle text="Parametrização do sistema" />
        <FieldsetCard legend="Dados da empresa" obrigatoryFields>
          <FormEnterprisePerson {...personParams} />
        </FieldsetCard>
        <FieldsetCard legend="Dados de contato da empresa" obrigatoryFields>
          <FormContact {...contactParams} />
        </FieldsetCard>
        <FieldsetCard legend="Dados adicionais">
          <Row>
            <FormInputFile
              colSm={12}
              id="logotipo"
              label="Logotipo"
              obrigatory={false}
              onChange={(e) => {
                const files = e.target.files as FileList;
                const file = files[0];
                this.setState({ logotype: file });
              }}
            />
          </Row>
        </FieldsetCard>
        <FormButtonsSave
          backLink={'/'}
          clear={false}
          save
          persistData={this.persistData}
        />
      </>
    );
  }
}
