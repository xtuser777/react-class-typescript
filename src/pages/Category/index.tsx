import React, { ChangeEvent, Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Row } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputText } from '../../components/form-input-text';
import { BillPayCategory as BillPayCategoryModel } from '../../models/BillPayCategory';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  category: BillPayCategoryModel;
  description: string;
  errorDescription?: string;
}

class Category extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;

  constructor(props: IComponentProps) {
    super(props);

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = { category: new BillPayCategoryModel(), description: '' };
  }

  getData = async () => {
    const data = await new BillPayCategoryModel().getOne(this.id);
    if (data) {
      this.setState({ category: data, description: data.description });
    }
  };

  async componentDidMount() {
    if (this.method == 'editar') await this.getData();
  }

  validate = {
    description: (value: string) => {
      if (value.length == 0) {
        this.setState({
          errorDescription: 'A descrição da categoria precisa ser preenchida.',
        });
        return false;
      } else {
        this.setState({ errorDescription: undefined });
        this.state.category.description = value;
        return true;
      }
    },
  };

  handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: e.target.value });
    this.validate.description(e.target.value);
  };

  validateFields = () => {
    const desc = this.validate.description(this.state.description);

    return desc;
  };

  clearFields = () => {
    this.setState({ description: '' });
  };

  persistData = async () => {
    const { category } = this.state;
    if (this.validateFields()) {
      if (this.method == 'novo') {
        if (await category.save()) this.clearFields();
      } else await category.update();
    }
  };

  render() {
    const { description, errorDescription } = this.state;

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Cadastrar Novo Categoria de Contas'
              : 'Detalhes do Categoria de Contas'
          }
        />
        <FieldsetCard legend="Dados da Categoria" obrigatoryFields>
          <Row>
            <FormInputText
              colSm={12}
              id="desc"
              label="Descrição"
              obrigatory
              value={description}
              onChange={(e) => this.handleDescriptionChange(e)}
              message={errorDescription}
            />
          </Row>
        </FieldsetCard>
        <FormButtonsSave
          backLink="/categorias"
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
  return <Category params={useParams()} />;
};
