import { Component } from 'react';
import { Row, Col, FormGroup, Label, Input, Badge } from 'reactstrap';
import { FieldsetCard } from '../fieldset-card';
import { FormButton } from '../form-button';
import { FormInputGroupText } from '../form-input-group-text';
import { FormInputNumber } from '../form-input-number';
import { IFormSaleItemProps, IFormSaleItemState } from './types';
import { FormSaleItemFunctions } from './functions';
import { FormSaleItemHandles } from './handles';

export class FormSaleItem extends Component<IFormSaleItemProps, IFormSaleItemState> {
  public functions: FormSaleItemFunctions;
  private handles: FormSaleItemHandles;

  constructor(props: IFormSaleItemProps) {
    super(props);

    this.functions = new FormSaleItemFunctions(this);
    this.handles = new FormSaleItemHandles(this, this.functions);

    this.state = {
      representations: [],
      representationsDb: [],
      products: [],
      productsDb: [],
      itemRepresentation: '0',
      itemRepresentationFilter: '',
      item: '0',
      itemFilter: '',
      itemPrice: '',
      itemQuantity: 1,
      totalItemPrice: '',
    };
  }

  async componentDidMount() {
    await this.functions.getRepresentations(await this.functions.getProducts());
  }

  render() {
    const {
      representations,
      products,
      item,
      itemRepresentationFilter,
      itemRepresentation,
      itemFilter,
      itemPrice,
      itemQuantity,
      totalItemPrice,
      errorItem,
      errorItemRepresentation,
      errorItemPrice,
      errorItemQuantity,
      errorTotalItemPrice,
    } = this.state;

    return (
      <>
        <FieldsetCard legend="Adicionar Item" obrigatoryFields>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label for="filtro-representacao-item">
                  Representação <span style={{ color: 'red' }}>*</span> :
                </Label>
                <Input
                  type="text"
                  id="filtro-representacao-item"
                  bsSize="sm"
                  style={{ width: '100%', marginBottom: '5px' }}
                  value={itemRepresentationFilter}
                  onChange={this.handles.handleItemRepresentationFilterChange}
                />
                <Input
                  type="select"
                  id="representacao-item"
                  bsSize="sm"
                  style={{ width: '100%' }}
                  value={itemRepresentation}
                  onChange={this.handles.handleItemRepresentationChange}
                >
                  {representations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.person.enterprise?.fantasyName + ' (' + item.unity + ')'}
                    </option>
                  ))}
                </Input>
                <Badge
                  id={`ms-representacao-item`}
                  color="danger"
                  className={errorItemRepresentation ? 'hidden' : ''}
                >
                  {errorItemRepresentation ? errorItemRepresentation : ''}
                </Badge>
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="filtro-item">
                  Produto <span style={{ color: 'red' }}>*</span> :
                </Label>
                <Input
                  type="text"
                  id="filtro-item"
                  bsSize="sm"
                  style={{ width: '100%', marginBottom: '5px' }}
                  value={itemFilter}
                  onChange={this.handles.handleItemFilterChange}
                />
                <Input
                  type="select"
                  id="item"
                  bsSize="sm"
                  style={{ width: '100%' }}
                  value={item}
                  onChange={this.handles.handleItemChange}
                  message={errorItem}
                >
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.description}
                    </option>
                  ))}
                </Input>
                <Badge
                  id={`ms-item`}
                  color="danger"
                  className={errorItem ? 'hidden' : ''}
                >
                  {errorItem ? errorItem : ''}
                </Badge>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <FormInputGroupText
              colSm={3}
              id="preco-produto"
              label="Valor Unitário"
              groupText={'R$'}
              obrigatory
              mask="#.##0,00"
              maskReversal={true}
              maskPlaceholder="0,00"
              value={itemPrice}
              onChange={this.handles.handleItemPriceChange}
              readonly
              message={errorItemPrice}
            />
            <FormInputNumber
              colSm={2}
              id="quantidade-item"
              label="Qtde desejada"
              obrigatory
              value={itemQuantity}
              onChange={this.handles.handleItemQuantityChange}
              message={errorItemQuantity}
            />
            <FormInputGroupText
              colSm={3}
              id="preco-total-item"
              label="Valor Total"
              groupText={'R$'}
              obrigatory
              mask="#.##0,00"
              maskReversal={true}
              maskPlaceholder="0,00"
              value={totalItemPrice}
              onChange={this.handles.handleTotalItemPriceChange}
              readonly
              message={errorTotalItemPrice}
            />
            <FormButton
              colSm={2}
              color="primary"
              id="limpar-item"
              text="LIMPAR"
              onClick={this.handles.handleClearItemClick}
            />
            <FormButton
              colSm={2}
              color="success"
              id="adicionar-item"
              text="ADICIONAR"
              onClick={this.handles.handleAddItemClick}
            />
          </Row>
        </FieldsetCard>
      </>
    );
  }
}
