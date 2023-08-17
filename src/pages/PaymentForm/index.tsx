import React, { ChangeEvent, Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Row } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputText } from '../../components/form-input-text';
import { FormInputNumber } from '../../components/form-input-number';
import { FormInputSelect } from '../../components/form-input-select';
import { PaymentForm as PaymentFormModel } from '../../models/PaymentForm';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  form: PaymentFormModel;
  description: string;
  link: string;
  deadLine: number;
  errorDescription?: string;
  errorLink?: string;
  errorDeadLine?: string;
}

class PaymentForm extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;

  constructor(props: IComponentProps) {
    super(props);

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = {
      form: new PaymentFormModel(),
      description: '',
      link: '0',
      deadLine: 0,
    };
  }

  getData = async () => {
    const data = await new PaymentFormModel().getOne(this.id);
    if (data) {
      this.setState({
        form: data,
        description: data.description,
        link: data.link.toString(),
        deadLine: data.deadline,
      });
    }
  };

  async componentDidMount() {
    if (this.method == 'editar') await this.getData();
  }

  validate = {
    description: (value: string) => {
      if (value.length == 0) {
        this.setState({
          errorDescription: 'A descrição da forma de pagamento precisa ser preenchida.',
        });
        return false;
      } else {
        this.setState({
          errorDescription: undefined,
        });
        this.state.form.description = value;
        return true;
      }
    },
    link: (value: string) => {
      if (value == '0') {
        this.setState({
          errorLink: 'O vínculo da forma de pagamento precisa ser selecionado.',
        });
        return false;
      } else {
        this.setState({ errorLink: undefined });
        this.state.form.link = Number(value);
        return true;
      }
    },
    deadline: (value: number) => {
      if (value <= 0) {
        this.setState({ errorDeadLine: 'O prazo de pagamento precisa ser preenchido.' });
        return false;
      } else {
        this.setState({ errorDeadLine: undefined });
        this.state.form.deadline = value;
        return true;
      }
    },
  };

  handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: e.target.value });
    this.validate.description(e.target.value);
  };

  handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ link: e.target.value });
    this.validate.link(e.target.value);
  };

  handleDeadLineChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ deadLine: Number.parseInt(e.target.value) });
    this.validate.deadline(Number.parseInt(e.target.value));
  };

  validateFields = () => {
    const { description, link, deadLine } = this.state;
    const desc = this.validate.description(description);
    const lnk = this.validate.link(link);
    const dln = this.validate.deadline(deadLine);

    return desc && lnk && dln;
  };

  clearFields = () => {
    this.setState({ description: '', link: '0', deadLine: 0 });
  };

  persistData = async () => {
    const { form } = this.state;
    if (this.validateFields()) {
      if (this.method == 'novo') {
        if (await form.save()) this.clearFields();
      } else await form.update();
    }
  };

  render() {
    const { description, link, deadLine, errorDescription, errorLink, errorDeadLine } =
      this.state;

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Cadastrar Nova Forma de Pagamento'
              : 'Detalhes da Forma de Pagamento'
          }
        />
        <FieldsetCard legend="Dados da Forma de Pagamento" obrigatoryFields>
          <Row>
            <FormInputText
              colSm={6}
              id="desc"
              label="Descrição"
              obrigatory
              value={description}
              onChange={(e) => this.handleDescriptionChange(e)}
              message={errorDescription}
            />
            <FormInputSelect
              colSm={3}
              id="vinculo"
              label="Vínculo"
              obrigatory
              value={link}
              onChange={(e) => this.handleLinkChange(e)}
              message={errorLink}
            >
              <option value="0">SELECIONE</option>
              <option value="1">CONTA A PAGAR</option>
              <option value="2">CONTA A RECEBER</option>
            </FormInputSelect>
            <FormInputNumber
              colSm={3}
              id="deadline"
              label="Prazo (dias)"
              obrigatory
              value={deadLine}
              onChange={(e) => this.handleDeadLineChange(e)}
              message={errorDeadLine}
            />
          </Row>
        </FieldsetCard>
        <FormButtonsSave
          backLink="/formaspagamento"
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
  return <PaymentForm params={useParams()} />;
};
