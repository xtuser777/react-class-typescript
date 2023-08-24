import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormContact } from '../../components/form-contact';
import { FormIndividualPerson } from '../../components/form-individual-person';
import { FormAuthenticationData } from '../../components/form-authentication-data';
import { Employee as EmployeeModel } from '../../models/Employee';
import { AuthState } from '../../store/modules/auth/reducer';
import { FormButtonsSave } from '../../components/form-buttons-save';

interface UserProps {
  authState: AuthState;
}

interface UserState {
  employee: EmployeeModel;
  type: number;
}

export class User extends Component<UserProps, UserState> {
  private fetchedData: boolean;
  private personRef: React.RefObject<FormIndividualPerson>;
  private contactRef: React.RefObject<FormContact>;
  private authRef: React.RefObject<FormAuthenticationData>;

  constructor(props: UserProps) {
    super(props);

    this.fetchedData = false;

    this.personRef = createRef<FormIndividualPerson>();
    this.contactRef = createRef<FormContact>();
    this.authRef = createRef<FormAuthenticationData>();

    this.state = {
      employee: new EmployeeModel(),
      type: 1,
    };
  }

  loadData = async () => {
    const user = await new EmployeeModel().getOne(this.props.authState.user.id);
    if (user) {
      this.setState({
        employee: user,
        type: user.type,
      });
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

  validateFields = async () => {
    return (
      (await this.personRef.current?.validateFields()) &&
      this.contactRef.current?.validateFields() &&
      (this.state.type == 1 ? await this.authRef.current?.validateFields() : true)
    );
  };

  persistData = async () => {
    if (await this.validateFields()) {
      await this.state.employee.update();
    }
  };

  render(): React.ReactNode {
    const { employee } = this.state;

    const personFields = {
      modelPerson: employee.person,
      ref: this.personRef,
    };

    const contactFields = {
      modelContact: employee.person.contact,
      ref: this.contactRef,
    };

    const authFields = {
      employee,
      page: 'data',
      ref: this.authRef,
    };

    return (
      <>
        <CardTitle text="Dados do Funcionário" />
        <FieldsetCard legend="Dados pessoais do funcionário" obrigatoryFields>
          <FormIndividualPerson {...personFields} />
        </FieldsetCard>
        <FieldsetCard legend="Dados de contato do funcionário" obrigatoryFields>
          <FormContact {...contactFields} />
        </FieldsetCard>
        {this.state.type == 1 ? (
          <FieldsetCard legend="Dados de autenticação" obrigatoryFields>
            <FormAuthenticationData {...authFields} />
          </FieldsetCard>
        ) : (
          ''
        )}
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

// const mapStateToProps = (state: RootState) => ({
//   authState: state.auth,
// });

// export default connect(mapStateToProps)(User);
