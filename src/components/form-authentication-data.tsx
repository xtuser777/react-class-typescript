import React, { Component } from 'react';
import { FaKey, FaUserAlt } from 'react-icons/fa';
import { Row } from 'reactstrap';
import { FormInputSelect } from './form-input-select';
import { FormInputGroupText } from './form-input-group-text';
import { FormInputGroupPassword } from './form-input-group-password';
import { ILevel } from '../models/Level';
import { Employee, IEmployee } from '../models/Employee';
import axios from '../services/axios';
import { validate } from '../utils/validate';

interface IComponentProps {
  page: string;
  employee: IEmployee;
}

interface IComponentState {
  level: string;
  login: string;
  password: string;
  passwordConfirm: string;
  levels: ILevel[];
  errorLevel?: string;
  errorLogin?: string;
  errorPassword?: string;
  errorPasswordConfirm?: string;
}

export class FormAuthenticationData extends Component<IComponentProps, IComponentState> {
  constructor(props: IComponentProps) {
    super(props);

    this.state = {
      level: '',
      login: '',
      password: '',
      passwordConfirm: '',
      levels: [],
      errorLevel: undefined,
      errorLogin: undefined,
      errorPassword: undefined,
      errorPasswordConfirm: undefined,
    };
  }

  loadLevels = async () => {
    const levels = (await axios.get('/level')).data as ILevel[];
    this.setState({ levels });
  };

  async componentDidMount(): Promise<void> {
    await this.loadLevels();
    setTimeout(() => {
      this.setState({
        level: this.props.employee.level.id.toString(),
        login: this.props.employee.login,
      });
    }, 300);
  }

  verifyAdmin = async () => {
    const users = await new Employee().get();
    const user = users.filter((item) => item.level.id == 1);

    return (
      user.length == 1 && this.props.employee.level && this.props.employee.level.id == 1
    );
  };

  vefifyLogin = async (login: string): Promise<boolean> => {
    const users = await axios.get('/employee');
    const user = users.data.find((item: { login: string }) => item.login == login);
    if (user) {
      if (user.id == this.props.employee.id) return false;
      else return true;
    }

    return false;
  };

  validateFields = async () => {
    let level = undefined;
    if (this.props.page == 'employee')
      level = (
        await validate.auth.level(
          this.state.level,
          this.verifyAdmin,
          this.state.levels,
          this.props.employee,
        )
      ).message;
    const login = (
      await validate.auth.login(this.state.login, this.vefifyLogin, this.props.employee)
    ).message;
    const password = validate.auth.password(
      this.state.password,
      this.props.employee,
    ).message;
    const passwordConfirm = validate.auth.passwordConfirm(
      this.state.passwordConfirm,
      this.state.password,
    ).message;
    this.setState({
      errorLevel: level,
      errorLogin: login,
      errorPassword: password,
      errorPasswordConfirm: passwordConfirm,
    });
    return !level && !login && !password && !passwordConfirm;
  };

  clearFields = () => {
    this.setState({
      level: '0',
      login: '',
      password: '',
      passwordConfirm: '',
    });
  };

  render(): React.ReactNode {
    return (
      <>
        <Row>
          <FormInputSelect
            colSm={6}
            id="nivel"
            label="Nível"
            obrigatory
            value={this.state.level}
            onChange={async (e) => {
              this.setState({ level: e.target.value });
              this.setState({
                errorLevel: (
                  await validate.auth.level(
                    e.target.value,
                    this.verifyAdmin,
                    this.state.levels,
                    this.props.employee,
                  )
                ).message,
              });
            }}
            message={this.state.errorLevel}
            disable={this.props.page == 'data'}
          >
            <option value="0">SELECIONAR</option>
            {this.state.levels
              ? this.state.levels.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.description}
                  </option>
                ))
              : ''}
          </FormInputSelect>
          <FormInputGroupText
            colSm={6}
            id="login"
            label="Login"
            groupText={<FaUserAlt />}
            obrigatory
            value={this.state.login}
            onChange={async (e) => {
              this.setState({ login: e.target.value });
              this.setState({
                errorLogin: (
                  await validate.auth.login(
                    e.target.value,
                    this.vefifyLogin,
                    this.props.employee,
                  )
                ).message,
              });
            }}
            message={this.state.errorLogin}
          />
        </Row>
        <Row>
          <FormInputGroupPassword
            colSm={6}
            id="senha"
            label="Senha"
            groupText={<FaKey />}
            obrigatory
            value={this.state.password}
            onChange={(e) => {
              this.setState({ password: e.target.value });
              this.setState({
                errorPassword: validate.auth.password(e.target.value, this.props.employee)
                  .message,
              });
            }}
            message={this.state.errorPassword}
          />
          <FormInputGroupPassword
            colSm={6}
            id="conf-senha"
            label="Confirmar Senha"
            groupText={<FaKey />}
            obrigatory
            value={this.state.passwordConfirm}
            onChange={(e) => {
              this.setState({ passwordConfirm: e.target.value });
              this.setState({
                errorPasswordConfirm: validate.auth.passwordConfirm(
                  e.target.value,
                  this.state.password,
                ).message,
              });
            }}
            message={this.state.errorPasswordConfirm}
          />
        </Row>
      </>
    );
  }
}
