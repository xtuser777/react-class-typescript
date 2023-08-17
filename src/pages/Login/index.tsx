import React, { ChangeEvent, Component, KeyboardEvent, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { Badge, Button, FormGroup, Input, Label } from 'reactstrap';

import './style.css';
import { connect } from 'react-redux';
import * as actions from '../../store/modules/auth/actions';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import { LoginAction, LoginRequestAction } from '../../store/modules/auth/types';
import { AuthState } from '../../store/modules/auth/reducer';

interface LoginProps {
  auth: AuthState;
  dispatchLoginAction: (login: string, password: string) => LoginRequestAction;
}

interface LoginState {
  login: string;
  errorLogin: string;
  password: string;
  errorPassword: string;
}

class Login extends Component<LoginProps, LoginState> {
  private errors: boolean;

  constructor(props: LoginProps) {
    super(props);
    this.errors = false;
    this.state = {
      login: '',
      errorLogin: '',
      password: '',
      errorPassword: '',
    };
  }

  handleClick = () => {
    const { login, password } = this.state;
    if (login.length == 0) {
      this.errors = true;
      this.setState({ errorLogin: 'O Login precisa ser preenchido!' });
    } else {
      this.errors = false;
      this.setState({ errorLogin: '' });
    }

    if (password.length == 0) {
      this.errors = true;
      this.setState({ errorPassword: 'A senha precisa ser preenchida!' });
    } else {
      if (password.length < 6) {
        this.errors = true;
        this.setState({ errorPassword: 'A senha precisa ter 6 caracteres!' });
      } else {
        this.errors = false;
        this.setState({ errorPassword: '' });
      }
    }

    if (!this.errors) {
      this.props.dispatchLoginAction(login, password);
    }
  };

  handlePasswordKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      this.handleClick();
    }
  };

  render() {
    const { login, password, errorLogin, errorPassword } = this.state;
    return (
      <>
        <CardTitle text="Autenticação do Usuário" />
        <div className="box">
          <div className="logo "></div>
          <br />
          <br />
          <FormGroup>
            <Label for="login">Login:</Label>
            <Input
              type="text"
              name="login"
              id="login"
              bsSize="sm"
              value={login}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.setState({ login: e.target.value })
              }
              autoFocus
            />
            <Badge
              id="erro-login"
              color="danger"
              className={errorLogin.length == 0 ? 'hidden' : ''}
            >
              {errorLogin}
            </Badge>
          </FormGroup>
          <FormGroup>
            <Label for="senha">Senha:</Label>
            <Input
              type="password"
              name="senha"
              id="senha"
              bsSize="sm"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.setState({ password: e.target.value })
              }
              onKeyDown={this.handlePasswordKeypress}
            />
            <Badge
              id="erro-password"
              color="danger"
              className={errorPassword.length == 0 ? 'hidden' : ''}
            >
              {errorPassword}
            </Badge>
          </FormGroup>
          <Button
            color="primary"
            id="btnEntrar"
            size="sm"
            className="btn-login"
            onClick={this.handleClick}
          >
            ENTRAR
          </Button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch<LoginAction>) => ({
  dispatchLoginAction: (login: string, password: string) =>
    dispatch(actions.loginRequest({ login, password })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
