import React, { Component, createRef } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Button, Col, Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormInputNumber } from '../../components/form-input-number';
import { FreightBudget as FreightBudgetModel } from '../../models/FreightBudget';
import { ICity } from '../../models/City';
import { IRepresentation } from '../../models/Representation';
import { IState } from '../../models/State';
import { ISaleBudget } from '../../models/SaleBudget';
import { formatarValor } from '../../utils/format';
import { IFreightItem } from '../../models/FreightItem';
import { ITruckType } from '../../models/TruckType';
import { FaTrash } from 'react-icons/fa';
import { FormFreightItem } from '../../components/form-freight-item';
import { IFreightBudgetProps, IFreightBudgetState } from './types';
import { Validate } from './validations';
import { FreightBudgetFunctions } from './functions';
import { FreightBudgetHandles } from './handles';
import { IClient } from '../../models/Client';

export class FreightBudgetComponent extends Component<
  IFreightBudgetProps,
  IFreightBudgetState
> {
  private id: number;
  public method: string;
  public itemRef: React.RefObject<FormFreightItem>;
  private validate: Validate;
  private functions: FreightBudgetFunctions;
  private handles: FreightBudgetHandles;

  constructor(props: IFreightBudgetProps) {
    super(props);
    this.itemRef = createRef();
    this.functions = new FreightBudgetFunctions(this);
    this.handles = new FreightBudgetHandles(this.functions);
    this.validate = new Validate(this, this.functions);
    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);
    this.state = {
      budget: new FreightBudgetModel(),
      sales: new Array<ISaleBudget>(),
      representationsDb: new Array<IRepresentation>(),
      clients: new Array<IClient>(),
      states: new Array<IState>(),
      cities: new Array<ICity>(),
      types: new Array<ITruckType>(),
      description: '',
      salesBudget: '0',
      representation: '0',
      client: '0',
      destinyState: '0',
      destinyCity: '0',
      truckType: '0',
      distance: 0,
      weight: '',
      price: '',
      shipping: new Date().toISOString().substring(0, 10),
      dueDate: new Date().toISOString().substring(0, 10),
      minimumFloor: 0,
      addItems: false,
      items: new Array<IFreightItem>(),
    };
  }

  async componentDidMount() {
    await this.functions.getSales();
    await this.functions.getClients();
    await this.functions.getRepresentations();
    if (this.method == 'editar')
      await this.functions.getData(this.id, await this.functions.getStates());
    else await this.functions.getStates();
  }

  render() {
    const {
      budget,
      sales,
      representationsDb,
      clients,
      states,
      cities,
      types,
      description,
      salesBudget,
      representation,
      client,
      destinyState,
      destinyCity,
      truckType,
      distance,
      weight,
      price,
      shipping,
      dueDate,
      addItems,
      items,
      errorDescription,
      errorClient,
      errorDestinyState,
      errorDestinyCity,
      errorType,
      errorDistance,
      errorWeight,
      errorPrice,
      errorShipping,
      errorDueDate,
    } = this.state;

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Abrir Orçamento de Frete'
              : 'Detalhes do Orçamento de Frete'
          }
        />
        <FieldsetCard legend="Dados do Orçamento" obrigatoryFields>
          <Row>
            <FormInputText
              colSm={12}
              id="desc"
              label="Descrição"
              obrigatory
              value={description}
              onChange={(e) => this.handles.handleDescriptionChange(this, e)}
              message={errorDescription}
            />
          </Row>
          <Row>
            <FormInputSelect
              colSm={4}
              id="orcamento-venda"
              label="Orçamento Venda"
              obrigatory={false}
              value={salesBudget}
              onChange={(e) => this.handles.handleSalesBudgetChange(this, e)}
              disable={representation != '0' ? true : false}
            >
              <option value="0">SELECIONAR</option>
              {sales.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.description}
                </option>
              ))}
            </FormInputSelect>
            <FormInputSelect
              colSm={4}
              id="representacao"
              label="Representação"
              obrigatory={false}
              value={representation}
              onChange={(e) => this.handles.handleRepresentationChange(this, e)}
              disable={salesBudget != '0' ? true : false}
            >
              <option value="0">SELECIONAR</option>
              {representationsDb.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.person.enterprise?.fantasyName + ' (' + item.unity + ')'}
                </option>
              ))}
            </FormInputSelect>
            <FormInputSelect
              colSm={4}
              id="cliente"
              label="Cliente"
              obrigatory
              value={client}
              onChange={(e) => this.handles.handleClientChange(this, e)}
              message={errorClient}
            >
              <option value="0">SELECIONAR</option>
              {clients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.person.type == 1
                    ? item.person.individual?.name
                    : item.person.enterprise?.fantasyName}
                </option>
              ))}
            </FormInputSelect>
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Itens fretados">
          <div className="table-container" style={{ height: '150px' }}>
            <Table id="tableItens" hover striped size="sm">
              <thead>
                <tr>
                  <th>DESCRIÇÃO</th>
                  <th>REPRESENTAÇÃO</th>
                  <th>PESO (KG)</th>
                  <th>QTDE.</th>
                  <th>TOTAL (KG)</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>

              <tbody id="tbodyItens">
                {this.functions.filterItems().map((item) => (
                  <tr key={item.product.id}>
                    <td>{item.product.description}</td>
                    <td>
                      {item.product.representation.person.enterprise?.fantasyName +
                        ' (' +
                        item.product.representation.unity +
                        ')'}
                    </td>
                    <td>{formatarValor(item.product.weight)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatarValor(item.weight)}</td>
                    <td>
                      <FaTrash
                        role="button"
                        color="red"
                        size={14}
                        title="Excluir"
                        onClick={() => this.handles.handleDelItemClick(this, item)}
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
                onClick={() => this.handles.handleClearItemsClick(this)}
                disabled={salesBudget != '0' ? true : false}
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
                disabled={salesBudget != '0' ? true : false}
              >
                {addItems ? 'CONCLUIR ADIÇÂO' : 'ADICIONAR ITENS'}
              </Button>
            </Col>
          </Row>
        </FieldsetCard>
        {addItems ? (
          <FormFreightItem
            ref={this.itemRef}
            changeItem={this.functions.changeItem}
            setErrorType={this.functions.setErrorType}
            budget={budget.toAttributes}
            items={items}
            types={types}
            representation={representation}
          />
        ) : (
          ''
        )}
        <FieldsetCard legend="Dados do transporte" obrigatoryFields>
          <Row>
            <FormInputSelect
              colSm={3}
              id="estado-destino"
              label="Estado de destino"
              obrigatory
              value={destinyState}
              onChange={(e) => this.handles.handleDestinyStateChange(this, e)}
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
              colSm={3}
              id="cidade-destino"
              label="Cidade de destino"
              obrigatory
              value={destinyCity}
              onChange={(e) => this.handles.handleDestinyCityChange(this, e)}
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
            <FormInputSelect
              colSm={3}
              id="truck-type"
              label="Tipo Caminhão"
              obrigatory
              value={truckType}
              onChange={(e) => this.handles.handleTruckTypeChange(this, e)}
              message={errorType}
            >
              <option value="0">SELECIONAR</option>
              {types.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.description + ' - ' + item.axes + ' EIXOS'}
                </option>
              ))}
            </FormInputSelect>
            <FormInputNumber
              colSm={3}
              id="distancia"
              label="Distância"
              obrigatory
              value={distance}
              onChange={(e) => this.handles.handleDistanceChange(this, e)}
              message={errorDistance}
            />
          </Row>
        </FieldsetCard>
        <FieldsetCard legend="Valores do Orçamento" obrigatoryFields>
          <Row>
            <FormInputGroupText
              colSm={3}
              id="peso"
              label="Peso"
              groupText={'KG'}
              obrigatory
              mask="##0,0"
              maskReversal={true}
              maskPlaceholder="0,0"
              value={weight}
              onChange={(e) => this.handles.handleWeightChange(this, e)}
              readonly
              message={errorWeight}
            />
            <FormInputGroupText
              colSm={3}
              id="preco-frete"
              label="Valor Frete"
              groupText={'R$'}
              obrigatory
              mask="#.##0,00"
              maskReversal={true}
              maskPlaceholder="0,00"
              value={price}
              onChange={(e) => this.handles.handlePriceChange(this, e)}
              message={errorPrice}
            />
            <FormInputDate
              colSm={3}
              id="entrega"
              label="Data Aprox. de Entrega"
              obrigatory
              value={shipping}
              onChange={(e) => this.handles.handleShippingChange(this, e)}
              message={errorShipping}
            />
            <FormInputDate
              colSm={3}
              id="validade"
              label="Validade"
              obrigatory
              value={dueDate}
              onChange={(e) => this.handles.handleDueDateChange(this, e)}
              message={errorDueDate}
            />
          </Row>
        </FieldsetCard>
        <FormButtonsSave
          backLink="/orcamentos/frete"
          clear={this.method == 'novo' ? true : false}
          save
          clearFields={this.functions.clearFields}
          persistData={this.functions.persistData}
        />
      </>
    );
  }
}
