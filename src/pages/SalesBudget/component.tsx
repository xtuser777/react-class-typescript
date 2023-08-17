import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Button, Col, Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputGroupEmail } from '../../components/form-input-group-email';
import { BsPhoneFill, BsTelephoneFill } from 'react-icons/bs';
import { MdAlternateEmail } from 'react-icons/md';
import { FormInputDate } from '../../components/form-input-date';
import { SaleBudget } from '../../models/SaleBudget';
import { ICity } from '../../models/City';
import { formatarValor } from '../../utils/format';
import isEmail from 'validator/lib/isEmail';
import { toast } from 'react-toastify';
import { IndividualPerson } from '../../models/IndividualPerson';
import { EnterprisePerson } from '../../models/EnterprisePerson';
import { FaTrash } from 'react-icons/fa';
import { validateCnpj, validateCpf } from '../../utils/validate';
import { FormSaleItem } from '../../components/FormSaleItem';
import { ISalesBudgetProps, ISalesBudgetState } from './types';
import { SalesBudgetFunctions } from './functions';
import { SalesBudgetHandles } from './handles';

export class SalesBudgetComponent extends Component<
  ISalesBudgetProps,
  ISalesBudgetState
> {
  private id: number;
  public method: string;
  public itemsRef: React.RefObject<FormSaleItem>;
  private functions: SalesBudgetFunctions;
  private handles: SalesBudgetHandles;

  constructor(props: ISalesBudgetProps) {
    super(props);

    this.itemsRef = createRef();

    this.functions = new SalesBudgetFunctions(this);
    this.handles = new SalesBudgetHandles(this, this.functions);

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = {
      budget: new SaleBudget(),
      clients: [],
      states: [],
      cities: [],
      salesmans: [],
      client: '0',
      name: '',
      type: '1',
      cpf: '',
      cnpj: '',
      phone: '',
      cellphone: '',
      email: '',
      description: '',
      salesman: '0',
      destinyState: '0',
      destinyCity: '0',
      weight: '',
      price: '',
      dueDate: new Date().toISOString().substring(0, 10),
      items: [],
      addItems: false,
    };
  }

  async componentDidMount() {
    await this.functions.getClients();
    await this.functions.getSalesmans();
    if (this.method == 'editar')
      await this.functions.getData(this.id, await this.functions.getStates());
    else await this.functions.getStates();
  }

  validate = {
    name: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorName: 'O nome precisa ser preenchido' });
        return false;
      } else if (value.length < 3) {
        this.setState({ errorName: 'O nome preenchido é inválido' });
        return false;
      } else {
        this.setState({ errorName: undefined });
        this.state.budget.clientName = value;
        return true;
      }
    },
    type: (value: string) => {
      if (value == '0') {
        this.setState({ errorType: 'O tipo do cliente precisa ser selecionado.' });
        return false;
      } else {
        this.setState({ errorType: undefined });
        return true;
      }
    },
    cpf: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorCpf: 'O CPF precisa ser preenchido' });
        return false;
      } else if (!validateCpf(value)) {
        this.setState({ errorCpf: 'O CPF preenchido é inválido' });
        return false;
      } else {
        this.setState({ errorCpf: undefined });
        this.state.budget.clientDocument = value;
        return true;
      }
    },
    cnpj: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorCnpj: 'O CNPJ precisa ser preenchido.' });
        return false;
      } else if (!validateCnpj(value)) {
        this.setState({ errorCnpj: 'O CNPJ preenchido é inválido.' });
        return false;
      } else {
        this.setState({ errorCnpj: undefined });
        this.state.budget.clientDocument = value;
        return true;
      }
    },
    phone: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorPhone: 'O telefone precisa ser preenchido' });
        return false;
      } else if (value.length < 14) {
        this.setState({ errorPhone: 'O telefone preenchido é inválido' });
        return false;
      } else {
        this.setState({ errorPhone: undefined });
        this.state.budget.clientPhone = value;
        return true;
      }
    },
    cellphone: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorCellphone: 'O celular precisa ser preenchido' });
        return false;
      } else if (value.length < 15) {
        this.setState({ errorCellphone: 'O celular preenchido é inválido' });
        return false;
      } else {
        this.setState({ errorCellphone: undefined });
        this.state.budget.clientCellphone = value;
        return true;
      }
    },
    email: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorEmail: 'O e-mail precisa ser preenchido' });
        return false;
      } else if (!isEmail(value)) {
        this.setState({ errorEmail: 'O e-mail preenchido é inválido' });
        return false;
      } else {
        this.setState({ errorEmail: undefined });
        this.state.budget.clientEmail = value;
        return true;
      }
    },
    description: (value: string) => {
      if (value.length == 0) {
        this.setState({
          errorDescription: 'A descrição do orçamento precisa ser preenchida.',
        });
        return false;
      } else if (value.length < 2) {
        this.setState({
          errorDescription: 'A descrição preenchida tem tamanho inválido.',
        });
        return false;
      } else {
        this.setState({ errorDescription: undefined });
        this.state.budget.description = value;
        return true;
      }
    },
    destinyState: (value: string) => {
      if (value == '0') {
        this.setState({ errorDestinyState: 'O Estado precisa ser selecionado' });
        return false;
      } else {
        this.setState({ errorDestinyState: undefined });
        this.setState({ cities: this.state.states[Number(value) - 1].cities });
        return true;
      }
    },
    destinyCity: (value: string) => {
      const { cities, budget } = this.state;
      if (value == '0') {
        this.setState({ errorDestinyCity: 'A cidade precisa ser selecionada' });
        return false;
      } else {
        this.setState({ errorDestinyCity: undefined });
        const city = cities.find((item) => item.id == Number(value)) as ICity;
        budget.destiny = city;
        return true;
      }
    },
    items: () => {
      const { items, budget } = this.state;
      if (items.length == 0) {
        toast.info('Não há itens adicionados ao orçamento.');
        return false;
      } else {
        budget.items = items;
        return true;
      }
    },
    weight: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorWeight: 'O peso do frete precisa ser preenchido.' });
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        this.setState({ errorWeight: 'O peso do frete informado é inválido.' });
        return false;
      } else {
        this.setState({ errorWeight: undefined });
        this.state.budget.weight = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    price: (value: string) => {
      if (value.length == 0) {
        this.setState({ errorPrice: 'O preço do produto precisa ser preenchido.' });
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        this.setState({ errorPrice: 'O preço do produto informado é inválido.' });
        return false;
      } else {
        this.setState({ errorPrice: undefined });
        this.state.budget.value = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    dueDate: (value: string) => {
      const val = new Date(value + 'T12:00:00');
      const now = new Date(Date.now());
      if (value.length == 0) {
        this.setState({ errorDueDate: 'A data de validade precisa ser preenchida' });
        return false;
      } else if (
        now.getFullYear() == val.getFullYear() &&
        now.getMonth() == val.getMonth() &&
        now.getDate() > val.getDate()
      ) {
        this.setState({ errorDueDate: 'A data de validade preenchida é inválida' });
        return false;
      } else {
        this.setState({ errorDueDate: undefined });
        this.state.budget.validate = value;
        return true;
      }
    },
  };

  render() {
    const {
      clients,
      salesmans,
      items,
      states,
      cities,
      client,
      type,
      name,
      cpf,
      cnpj,
      phone,
      cellphone,
      email,
      description,
      salesman,
      destinyState,
      destinyCity,
      weight,
      price,
      dueDate,
      addItems,
      errorName,
      errorType,
      errorCpf,
      errorCnpj,
      errorPhone,
      errorCellphone,
      errorEmail,
      errorDescription,
      errorDestinyCity,
      errorDestinyState,
      errorWeight,
      errorPrice,
      errorDueDate,
    } = this.state;

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Abrir Orçamento de Venda'
              : 'Detalhes do Orçamento de Venda'
          }
        />
        <FieldsetCard legend="Dados do Cliente" obrigatoryFields>
          <Row>
            <FormInputSelect
              colSm={4}
              id="cliente"
              label="Cliente"
              obrigatory={false}
              value={client}
              onChange={this.handles.handleClientChange}
            >
              <option value="0">SELECIONAR</option>
              {clients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.person.type == 1
                    ? (item.person.individual as IndividualPerson).name
                    : (item.person.enterprise as EnterprisePerson).fantasyName}
                </option>
              ))}
            </FormInputSelect>
            <FormInputText
              colSm={4}
              id="nome"
              label="Nome / Nome Fantasia"
              obrigatory
              value={name}
              onChange={this.handles.handleNameChange}
              readonly={client != '0' ? true : false}
              message={errorName}
            />
            <FormInputSelect
              colSm={2}
              id="tipo-documento"
              label="Tipo"
              obrigatory
              value={type}
              onChange={this.handles.handleTypeChange}
              readonly={client != '0' ? true : false}
              message={errorType}
            >
              <option value="1">CPF</option>
              <option value="2">CNPJ</option>
            </FormInputSelect>
            {type == '1' ? (
              <FormInputText
                colSm={2}
                id="cpf"
                label="CPF"
                obrigatory
                mask="000.000.000-00"
                value={cpf}
                onChange={this.handles.handleCpfChange}
                readonly={client != '0' ? true : false}
                message={errorCpf}
              />
            ) : (
              <FormInputText
                colSm={2}
                id="cnpj"
                label="CNPJ"
                obrigatory
                mask="00.000.000/0000-00"
                value={cnpj}
                onChange={this.handles.handleCnpjChange}
                readonly={client != '0' ? true : false}
                message={errorCnpj}
              />
            )}
          </Row>
          <Row>
            <FormInputGroupText
              colSm={3}
              id="tel"
              label="Telefone"
              groupText={<BsTelephoneFill />}
              obrigatory
              mask="(00) 0000-0000"
              value={phone}
              onChange={(e) => this.handles.handlePhoneChange(e)}
              readonly={client != '0' ? true : false}
              message={errorPhone}
            />
            <FormInputGroupText
              colSm={3}
              id="cel"
              label="Celular"
              groupText={<BsPhoneFill />}
              obrigatory
              mask="(00) 00000-0000"
              value={cellphone}
              onChange={(e) => this.handles.handleCellphoneChange(e)}
              readonly={client != '0' ? true : false}
              message={errorCellphone}
            />
            <FormInputGroupEmail
              colSm={6}
              id="email"
              label="E-mail"
              groupText={<MdAlternateEmail />}
              obrigatory
              value={email}
              onChange={(e) => this.handles.handleEmailChange(e)}
              readonly={client != '0' ? true : false}
              message={errorEmail}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Dados do Orçamento" obrigatoryFields>
          <Row>
            <FormInputText
              colSm={12}
              id="desc"
              label="Descrição"
              obrigatory
              value={description}
              onChange={(e) => this.handles.handleDescriptionChange(e)}
              message={errorDescription}
            />
          </Row>
          <Row>
            <FormInputSelect
              colSm={5}
              id="vendedor"
              label="Vendedor"
              obrigatory={false}
              value={salesman}
              onChange={this.handles.handleSalesmanChange}
            >
              <option value="0">SELECIONAR</option>
              {salesmans.map((item) => (
                <option key={item.id} value={item.id}>
                  {(item.person.individual as IndividualPerson).name}
                </option>
              ))}
            </FormInputSelect>
            <FormInputSelect
              colSm={3}
              id="estado-destino"
              label="Estado de destino"
              obrigatory
              value={destinyState}
              onChange={this.handles.handleDestinyStateChange}
              message={errorDestinyState}
            >
              <option value="0">SELECIONAR</option>
              {states.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormInputSelect>
            <FormInputSelect
              colSm={4}
              id="cidade-destino"
              label="Cidade de destino"
              obrigatory
              value={destinyCity}
              onChange={this.handles.handleDestinyCityChange}
              disable={destinyState == '0' ? true : false}
              message={errorDestinyCity}
            >
              <option value="0">SELECIONAR</option>
              {cities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormInputSelect>
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Itens do Orçamento">
          <div className="table-container" style={{ height: '150px' }}>
            <Table id="tableItens" hover striped size="sm">
              <thead>
                <tr>
                  <th>DESCRIÇÃO</th>
                  <th>REPRESENTAÇÃO</th>
                  <th>VALOR (R$)</th>
                  <th>QTDE.</th>
                  <th>TOTAL (R$)</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>

              <tbody id="tbodyItens">
                {items.map((item) => (
                  <tr key={item.product.id}>
                    <td>{item.product.description}</td>
                    <td>
                      {item.product.representation.person.enterprise?.fantasyName +
                        ' (' +
                        item.product.representation.unity +
                        ')'}
                    </td>
                    <td>
                      {formatarValor(
                        item.product.representation.person.contact.address.city.state
                          .id == Number(destinyState)
                          ? item.product.price
                          : item.product.priceOut,
                      )}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatarValor(item.price)}</td>
                    <td>
                      <FaTrash
                        role="button"
                        color="red"
                        size={14}
                        title="Excluir"
                        onClick={() => {
                          this.handles.handleDelItemClick(item);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Row>
            <Col sm="4"></Col>
            <Col sm="4">
              <Button
                id="limpar-itens"
                color="primary"
                size="sm"
                style={{ width: '100%' }}
                onClick={this.handles.handleClearItemsClick}
              >
                LIMPAR ITENS
              </Button>
            </Col>
            <Col sm="4">
              <Button
                id="adicionar-itens"
                color={addItems ? 'secondary' : 'success'}
                size="sm"
                style={{ width: '100%' }}
                onClick={() => this.setState({ addItems: !addItems })}
              >
                {addItems ? 'CONCLUIR ADIÇÂO' : 'ADICIONAR ITENS'}
              </Button>
            </Col>
          </Row>
        </FieldsetCard>
        {addItems ? (
          <FormSaleItem
            changeItem={this.functions.changeItem}
            destinyState={destinyState}
            items={items}
            ref={this.itemsRef}
          />
        ) : (
          ''
        )}
        <FieldsetCard legend="Valores do Orçamento" obrigatoryFields>
          <Row>
            <FormInputGroupText
              colSm={4}
              id="peso"
              label="Peso"
              groupText={'KG'}
              obrigatory
              mask="##0,0"
              maskReversal={true}
              maskPlaceholder="0,0"
              value={weight}
              onChange={(e) => this.handles.handleWeightChange(e)}
              readonly
              message={errorWeight}
            />
            <FormInputGroupText
              colSm={4}
              id="preco"
              label="Preço"
              groupText={'R$'}
              obrigatory
              mask="#.##0,00"
              maskReversal={true}
              maskPlaceholder="0,00"
              value={price}
              onChange={(e) => this.handles.handlePriceChange(e)}
              readonly
              message={errorPrice}
            />
            <FormInputDate
              colSm={4}
              id="validade"
              label="Validade"
              obrigatory
              value={dueDate}
              onChange={this.handles.handleDueDateChange}
              message={errorDueDate}
            />
          </Row>
        </FieldsetCard>
        <FormButtonsSave
          backLink="/orcamentos/venda"
          clear={this.method == 'novo' ? true : false}
          save
          clearFields={this.functions.clearFields}
          persistData={this.functions.persistData}
        />
      </>
    );
  }
}
