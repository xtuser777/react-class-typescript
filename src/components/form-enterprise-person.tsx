import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { FormInputText } from './form-input-text';
import { validate } from '../utils/validate';
import { IPerson } from '../models/Person';

interface IComponentProps {
  modelPerson: IPerson;
  readonly?: boolean;
}

interface IComponentState {
  corporateName: string;
  fantasyName: string;
  cnpj: string;
  errorCorporateName?: string;
  errorFantasyName?: string;
  errorCnpj?: string;
}

export class FormEnterprisePerson extends Component<IComponentProps, IComponentState> {
  constructor(props: IComponentProps) {
    super(props);

    this.state = {
      corporateName: '',
      fantasyName: '',
      cnpj: '',
      errorCorporateName: undefined,
      errorFantasyName: undefined,
      errorCnpj: undefined,
    };
  }
  componentDidMount(): void {
    setTimeout(() => {
      if (this.props.modelPerson.enterprise) {
        this.setState({
          corporateName: this.props.modelPerson.enterprise.corporateName,
          fantasyName: this.props.modelPerson.enterprise.fantasyName,
          cnpj: this.props.modelPerson.enterprise.cnpj,
        });
      }
    }, 300);
  }
  validateFields = () => {
    const corporateName = validate.person.enterprise.corporateName(
      this.state.corporateName,
      this.props.modelPerson,
    ).message;
    const fantasyName = validate.person.enterprise.fantasyName(
      this.state.fantasyName,
      this.props.modelPerson,
    ).message;
    const cnpj = validate.person.enterprise.cnpj(
      this.state.cnpj,
      this.props.modelPerson,
    ).message;
    this.setState({
      errorCorporateName: corporateName,
      errorFantasyName: fantasyName,
      errorCnpj: cnpj,
    });
    return !corporateName && !fantasyName && !cnpj;
  };
  clearFields = () => {
    this.setState({
      corporateName: '',
      fantasyName: '',
      cnpj: '',
    });
  };
  render(): React.ReactNode {
    const { errorCorporateName, errorFantasyName, errorCnpj } = this.state;
    return (
      <>
        <Row>
          <FormInputText
            colSm={12}
            id="razao_social"
            label="Razão Social"
            obrigatory
            value={this.state.corporateName}
            onChange={(e) => {
              this.setState({ corporateName: e.target.value });
              this.setState({
                errorCorporateName: validate.person.enterprise.corporateName(
                  e.target.value,
                  this.props.modelPerson,
                ).message,
              });
            }}
            readonly={this.props.readonly ? true : false}
            message={errorCorporateName}
          />
        </Row>
        <Row>
          <FormInputText
            colSm={9}
            id="nome_fantasia"
            label="Nome Fantasia"
            obrigatory
            value={this.state.fantasyName}
            onChange={(e) => {
              this.setState({ fantasyName: e.target.value });
              this.setState({
                errorFantasyName: validate.person.enterprise.fantasyName(
                  e.target.value,
                  this.props.modelPerson,
                ).message,
              });
            }}
            readonly={this.props.readonly ? true : false}
            message={errorFantasyName}
          />
          <FormInputText
            colSm={3}
            id="cnpj"
            label="CNPJ"
            obrigatory
            mask="00.000.000/0000-00"
            value={this.state.cnpj}
            onChange={(e) => {
              this.setState({ cnpj: e.target.value });
              this.setState({
                errorCnpj: validate.person.enterprise.cnpj(
                  e.target.value,
                  this.props.modelPerson,
                ).message,
              });
            }}
            message={errorCnpj}
          />
        </Row>
      </>
    );
  }
}
