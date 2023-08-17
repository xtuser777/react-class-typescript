import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { FormInputText } from './form-input-text';
import { FormInputDate } from './form-input-date';
import { IIndividualPerson } from '../models/IndividualPerson';
import { validate } from '../utils/validate';
import { Employee } from '../models/Employee';
import { IPerson } from '../models/Person';

interface IComponentProps {
  modelPerson: IPerson;
  readonly?: boolean;
  employee?: boolean;
}

interface IComponentState {
  name: string;
  cpf: string;
  birth: string;
  errorName: string | undefined;
  errorCpf: string | undefined;
  errorBirthDate: string | undefined;
}

export class FormIndividualPerson extends Component<IComponentProps, IComponentState> {
  constructor(props: IComponentProps) {
    super(props);

    this.state = {
      name: '',
      cpf: '',
      birth: '',
      errorName: undefined,
      errorCpf: undefined,
      errorBirthDate: undefined,
    };
  }
  componentDidMount(): void {
    setTimeout(() => {
      if (this.props.modelPerson.individual) {
        this.setState({
          name: this.props.modelPerson.individual.name,
          cpf: this.props.modelPerson.individual.cpf,
          birth: this.props.modelPerson.individual.birth,
        });
      }
    }, 300);
  }
  verifyCpf = async (cpf: string) => {
    const users = await new Employee().get();
    const user = users.find(
      (item) => (item.person.individual as IIndividualPerson).cpf == cpf,
    );

    return (
      !!user &&
      !!this.props.modelPerson.individual &&
      this.props.modelPerson.individual.cpf != cpf
    );
  };
  validateFields = async () => {
    const name = validate.person.individual.name(
      this.state.name,
      this.props.modelPerson,
    ).message;
    const cpf = (
      await validate.person.individual.cpf(
        this.state.cpf,
        this.props.modelPerson,
        this.props.employee ? this.verifyCpf : undefined,
      )
    ).message;
    const birth = validate.person.individual.birth(
      this.state.birth,
      this.props.modelPerson,
    ).message;
    this.setState({ errorName: name, errorCpf: cpf, errorBirthDate: birth });
    return !name && !cpf && !birth;
  };
  clearFields = () => {
    this.setState({
      name: '',
      cpf: '',
      birth: '',
    });
  };
  render(): React.ReactNode {
    const { errorName, errorCpf, errorBirthDate } = this.state;
    return (
      <>
        <Row>
          <FormInputText
            colSm={6}
            id="nome"
            label="Nome"
            obrigatory
            value={this.state.name}
            onChange={(e) => {
              this.setState({ name: e.target.value });
              this.setState({
                errorName: validate.person.individual.name(
                  e.target.value,
                  this.props.modelPerson,
                ).message,
              });
            }}
            message={errorName ? errorName : undefined}
            readonly={this.props.readonly ? true : false}
          />
          <FormInputText
            colSm={3}
            id="cpf"
            label="CPF"
            obrigatory
            mask="000.000.000-00"
            value={this.state.cpf}
            onChange={async (e) => {
              this.setState({ cpf: e.target.value });
              this.setState({
                errorCpf: (
                  await validate.person.individual.cpf(
                    e.target.value,
                    this.props.modelPerson,
                    this.props.employee ? this.verifyCpf : undefined,
                  )
                ).message,
              });
            }}
            message={errorCpf ? errorCpf : undefined}
            readonly={this.props.readonly ? true : false}
          />
          <FormInputDate
            colSm={3}
            id="nasc"
            label="Nascimento"
            obrigatory
            value={this.state.birth}
            onChange={(e) => {
              this.setState({ birth: e.target.value });
              this.setState({
                errorBirthDate: validate.person.individual.birth(
                  e.target.value,
                  this.props.modelPerson,
                ).message,
              });
            }}
            message={errorBirthDate ? errorBirthDate : undefined}
            readonly={this.props.readonly ? true : false}
          />
        </Row>
      </>
    );
  }
}
