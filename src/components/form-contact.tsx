import React, { Component } from 'react';
import { BsPhoneFill, BsTelephoneFill } from 'react-icons/bs';
import { MdAlternateEmail } from 'react-icons/md';
import { Row } from 'reactstrap';
import { FormInputText } from './form-input-text';
import { FormInputGroupText } from './form-input-group-text';
import { FormInputGroupEmail } from './form-input-group-email';
import { FormInputSelect } from './form-input-select';
import { IState } from '../models/State';
import { ICity } from '../models/City';
import { IContact } from '../models/Contact';
import axios from '../services/axios';
import { validate } from '../utils/validate';

interface IComponentProps {
  modelContact: IContact;
  readonly?: boolean;
}

interface IComponentState {
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  code: string;
  state: string;
  city: string;
  phone: string;
  cellphone: string;
  email: string;
  states: IState[];
  cities: ICity[];
  errorStreet?: string;
  errorNumber?: string;
  errorNeighborhood?: string;
  errorCode?: string;
  errorState?: string;
  errorCity?: string;
  errorPhone?: string;
  errorCellphone?: string;
  errorEmail?: string;
}

export class FormContact extends Component<IComponentProps, IComponentState> {
  constructor(props: IComponentProps) {
    super(props);

    this.state = {
      street: '',
      number: '',
      neighborhood: '',
      complement: '',
      code: '',
      state: '0',
      city: '0',
      phone: '',
      cellphone: '',
      email: '',
      states: [],
      cities: [],
      errorStreet: undefined,
      errorNumber: undefined,
      errorNeighborhood: undefined,
      errorCode: undefined,
      errorState: undefined,
      errorCity: undefined,
      errorPhone: undefined,
      errorCellphone: undefined,
      errorEmail: undefined,
    };
  }
  loadStates = async () => {
    const receivedData = await axios.get('/state');
    this.setState({ states: receivedData.data as IState[] });
    return receivedData.data;
  };
  load = (states: IState[]) => {
    if (this.props.modelContact.id > 0) {
      this.setState({
        street: this.props.modelContact.address.street,
        number: this.props.modelContact.address.number,
        neighborhood: this.props.modelContact.address.neighborhood,
        complement: this.props.modelContact.address.complement,
        code: this.props.modelContact.address.code,
        state: this.props.modelContact.address.city.state.id.toString(),
        cities:
          states[Number(this.props.modelContact.address.city.state.id.toString()) - 1]
            .cities,
        city: this.props.modelContact.address.city.id.toString(),
        phone: this.props.modelContact.phone,
        cellphone: this.props.modelContact.cellphone,
        email: this.props.modelContact.email,
      });
    }
  };
  async componentDidMount(): Promise<void> {
    this.load(await this.loadStates());
  }
  validateFields = () => {
    const street = validate.contact.street(
      this.state.street,
      this.props.modelContact,
    ).message;
    const number = validate.contact.number(
      this.state.number,
      this.props.modelContact,
    ).message;
    const neighborhood = validate.contact.neighborhood(
      this.state.neighborhood,
      this.props.modelContact,
    ).message;
    const code = validate.contact.code(this.state.code, this.props.modelContact).message;
    const state = validate.contact.state(this.state.state).message;
    const city = validate.contact.city(
      this.state.city,
      this.props.modelContact,
      this.state.cities,
    ).message;
    const phone = validate.contact.phone(
      this.state.phone,
      this.props.modelContact,
    ).message;
    const cellphone = validate.contact.cellphone(
      this.state.cellphone,
      this.props.modelContact,
    ).message;
    const email = validate.contact.email(
      this.state.email,
      this.props.modelContact,
    ).message;
    this.setState({
      errorStreet: street,
      errorNumber: number,
      errorNeighborhood: neighborhood,
      errorCode: code,
      errorState: state,
      errorCity: city,
      errorPhone: phone,
      errorCellphone: cellphone,
      errorEmail: email,
    });
    return (
      !street &&
      !number &&
      !neighborhood &&
      !code &&
      !state &&
      !city &&
      !phone &&
      !cellphone &&
      !email
    );
  };
  clearFields = () => {
    this.setState({
      street: '',
      number: '',
      neighborhood: '',
      complement: '',
      code: '',
      state: '0',
      city: '0',
      cities: [],
      phone: '',
      cellphone: '',
      email: '',
    });
  };
  render(): React.ReactNode {
    return (
      <>
        <Row>
          <FormInputText
            colSm={5}
            id="rua"
            label="Rua"
            obrigatory
            value={this.state.street}
            onChange={(e) => {
              this.setState({ street: e.target.value });
              this.setState({
                errorStreet: validate.contact.street(
                  e.target.value,
                  this.props.modelContact,
                ).message,
              });
            }}
            message={this.state.errorStreet}
            readonly={this.props.readonly ? true : false}
          />
          <FormInputText
            colSm={1}
            id="numero"
            label="Número"
            obrigatory
            value={this.state.number}
            onChange={(e) => {
              this.setState({ number: e.target.value });
              this.setState({
                errorNumber: validate.contact.number(
                  e.target.value,
                  this.props.modelContact,
                ).message,
              });
            }}
            message={this.state.errorNumber}
            readonly={this.props.readonly ? true : false}
          />
          <FormInputText
            colSm={4}
            id="bairro"
            label="Bairro"
            obrigatory
            value={this.state.neighborhood}
            onChange={(e) => {
              this.setState({ neighborhood: e.target.value });
              this.setState({
                errorNeighborhood: validate.contact.neighborhood(
                  e.target.value,
                  this.props.modelContact,
                ).message,
              });
            }}
            message={this.state.errorNeighborhood}
            readonly={this.props.readonly ? true : false}
          />
          <FormInputText
            colSm={2}
            id="complemento"
            label="Complemento"
            obrigatory={false}
            value={this.state.complement}
            onChange={(e) => {
              this.setState({ complement: e.target.value });
              this.props.modelContact.address.complement = e.target.value;
            }}
            readonly={this.props.readonly ? true : false}
          />
        </Row>
        <Row>
          <FormInputSelect
            colSm={4}
            id="estado"
            label="Estado"
            obrigatory
            value={this.state.state}
            onChange={(e) => {
              this.setState({ state: e.target.value });
              const message = validate.contact.state(e.target.value).message;
              this.setState({
                errorState: message,
              });
              if (!message) {
                this.setState({
                  cities: this.state.states[Number(e.target.value) - 1].cities,
                });
              }
            }}
            message={this.state.errorState}
            disable={this.props.readonly ? true : false}
          >
            <option value="0">SELECIONE</option>
            {this.state.states.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </FormInputSelect>
          <FormInputSelect
            colSm={5}
            id="cidade"
            label="Cidade"
            obrigatory
            value={this.state.city}
            disable={this.state.state == '0' || this.props.readonly ? true : false}
            onChange={(e) => {
              this.setState({ city: e.target.value });
              this.setState({
                errorCity: validate.contact.city(
                  e.target.value,
                  this.props.modelContact,
                  this.state.cities,
                ).message,
              });
            }}
            message={this.state.errorCity}
          >
            <option value="0">SELECIONE</option>
            {this.state.cities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </FormInputSelect>
          <FormInputText
            colSm={3}
            id="cep"
            label="CEP"
            mask="00.000-000"
            value={this.state.code}
            obrigatory
            onChange={(e) => {
              this.setState({ code: e.target.value });
              this.setState({
                errorCode: validate.contact.code(e.target.value, this.props.modelContact)
                  .message,
              });
            }}
            message={this.state.errorCode}
            readonly={this.props.readonly ? true : false}
          />
        </Row>
        <Row>
          <FormInputGroupText
            colSm={3}
            id="tel"
            label="Telefone"
            groupText={<BsTelephoneFill />}
            obrigatory
            mask="(00) 0000-0000"
            value={this.state.phone}
            onChange={(e) => {
              this.setState({ phone: e.target.value });
              this.setState({
                errorPhone: validate.contact.phone(
                  e.target.value,
                  this.props.modelContact,
                ).message,
              });
            }}
            message={this.state.errorPhone}
            readonly={this.props.readonly ? true : false}
          />
          <FormInputGroupText
            colSm={3}
            id="cel"
            label="Celular"
            groupText={<BsPhoneFill />}
            obrigatory
            mask="(00) 00000-0000"
            value={this.state.cellphone}
            onChange={(e) => {
              this.setState({ cellphone: e.target.value });
              this.setState({
                errorCellphone: validate.contact.cellphone(
                  e.target.value,
                  this.props.modelContact,
                ).message,
              });
            }}
            message={this.state.errorCellphone}
            readonly={this.props.readonly ? true : false}
          />
          <FormInputGroupEmail
            colSm={6}
            id="email"
            label="E-mail"
            groupText={<MdAlternateEmail />}
            obrigatory
            value={this.state.email}
            onChange={(e) => {
              this.setState({ email: e.target.value });
              this.setState({
                errorEmail: validate.contact.email(
                  e.target.value,
                  this.props.modelContact,
                ).message,
              });
            }}
            message={this.state.errorEmail}
            readonly={this.props.readonly ? true : false}
          />
        </Row>
      </>
    );
  }
}
