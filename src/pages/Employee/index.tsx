import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormContact } from '../../components/form-contact';
import { FormIndividualPerson } from '../../components/form-individual-person';
import { FormAuthenticationData } from '../../components/form-authentication-data';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Row } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputDate } from '../../components/form-input-date';
import { Employee as EmployeeModel } from '../../models/Employee';
import { formatarDataIso } from '../../utils/format';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  employee: EmployeeModel;
  type: string;
  admission: string;
  errorType?: string;
  errorAdmission?: string;
}

class Employee extends Component<IComponentProps, IComponentState> {
  private method: string;
  private id: number;
  private personRef: React.RefObject<FormIndividualPerson>;
  private contactRef: React.RefObject<FormContact>;
  private authRef: React.RefObject<FormAuthenticationData>;

  constructor(props: IComponentProps) {
    super(props);

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.personRef = createRef<FormIndividualPerson>();
    this.contactRef = createRef<FormContact>();
    this.authRef = createRef<FormAuthenticationData>();

    this.state = {
      employee: new EmployeeModel(),
      type: '',
      admission: '',
      errorType: undefined,
      errorAdmission: undefined,
    };
  }

  loadData = async () => {
    const user = await new EmployeeModel().getOne(this.id);
    if (user) {
      this.setState({
        employee: user,
        admission: formatarDataIso(user.admission),
        type: user.type.toString(),
      });
    }
  };

  async componentDidMount() {
    if (this.method == 'editar') await this.loadData();
  }

  validate = {
    admission: (value: string) => {
      const val = new Date(value);
      const now = new Date(Date.now());
      if (value.length == 0) {
        this.setState({ errorAdmission: 'A data de admissão precisa ser preenchida' });
        return false;
      } else if (
        now.getFullYear() == val.getFullYear() &&
        now.getMonth() == val.getMonth() &&
        now.getDate() < val.getDate()
      ) {
        this.setState({ errorAdmission: 'A data de admissão preenchida é inválida' });
        return false;
      } else {
        this.setState({ errorAdmission: undefined });
        this.state.employee.admission = value;
        return true;
      }
    },
    type: (value: string) => {
      if (value == '0') {
        this.setState({ errorType: 'O tipo de funcionário precisa ser selecionado.' });
        return false;
      } else {
        this.setState({ errorType: undefined });
        this.state.employee.type = Number(value);
        return true;
      }
    },
  };

  validateFields = async () => {
    return (
      this.personRef.current?.validateFields() &&
      this.validate.admission(this.state.admission) &&
      this.validate.type(this.state.type) &&
      this.contactRef.current?.validateFields() &&
      (this.state.type == '1' ? this.authRef.current?.validateFields() : true)
    );
  };

  clearFields = () => {
    this.personRef.current?.clearFields();
    this.setState({
      employee: new EmployeeModel(),
      admission: '',
      type: '0',
    });
    this.contactRef.current?.clearFields();
    this.authRef.current?.clearFields();
  };

  persistData = async () => {
    const { employee } = this.state;
    console.log(employee);

    if (await this.validateFields()) {
      if (this.method == 'novo') {
        if (await employee.save()) this.clearFields();
      } else await employee.update();
    }
  };

  render(): React.ReactNode {
    const { employee } = this.state;

    const personFields = {
      modelPerson: employee.person,
      employee: true,
      ref: this.personRef,
    };

    const contactFields = {
      modelContact: employee.person.contact,
      ref: this.contactRef,
    };

    const authFields = {
      page: 'employee',
      employee,
      ref: this.authRef,
    };

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Cadastrar Novo Funcionário'
              : 'Detalhes do Funcionário'
          }
        />
        <FieldsetCard legend="Dados pessoais do Funcionário" obrigatoryFields>
          <FormIndividualPerson {...personFields} />
        </FieldsetCard>
        <FieldsetCard legend="Dados do Funcionário" obrigatoryFields>
          <Row>
            <FormInputDate
              colSm={6}
              id="adm"
              label="Admissão"
              obrigatory
              value={this.state.admission}
              onChange={(e) => {
                this.setState({ admission: e.target.value });
                this.validate.admission(e.target.value);
              }}
              message={this.state.errorAdmission}
              readonly={this.method == 'editar' ? true : false}
            />
            <FormInputSelect
              colSm={6}
              id="tipo"
              label="Tipo"
              obrigatory
              value={this.state.type}
              onChange={(e) => {
                this.setState({ type: e.target.value });
                this.validate.type(e.target.value);
              }}
              message={this.state.errorType}
              disable={this.method == 'editar' ? true : false}
            >
              <option value="0">SELECIONE</option>
              <option value="1">INTERNO</option>
              <option value="2">VENDEDOR</option>
            </FormInputSelect>
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Dados de contato do funcionário" obrigatoryFields>
          <FormContact {...contactFields} />
        </FieldsetCard>
        {this.state.type == '1' ? (
          <FieldsetCard legend="Dados de autenticação" obrigatoryFields>
            <FormAuthenticationData {...authFields} />
          </FieldsetCard>
        ) : (
          ''
        )}
        <FormButtonsSave
          backLink="/funcionarios"
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
  return <Employee params={useParams()} />;
};
