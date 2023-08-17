import React, { Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Row } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputText } from '../../components/form-input-text';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputNumber } from '../../components/form-input-number';
import { TruckType as TruckTypeModel } from '../../models/TruckType';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  type: TruckTypeModel;
  description: string;
  axes: number;
  capacity: string;
  errorDescription?: string;
  errorAxes?: string;
  errorCapacity?: string;
}

class TruckType extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;

  constructor(props: IComponentProps) {
    super(props);

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = {
      type: new TruckTypeModel(),
      description: '',
      axes: 0,
      capacity: '',
      errorDescription: undefined,
      errorAxes: undefined,
      errorCapacity: undefined,
    };
  }

  getData = async () => {
    const type = await new TruckTypeModel().getOne(this.id);
    if (type) {
      this.setState({
        type,
        description: type.description,
        axes: type.axes,
        capacity: type.capacity.toString(),
      });
    }
  };

  async componentDidMount() {
    if (this.method == 'editar') await this.getData();
  }

  validate = {
    description: (value: string) => {
      if (value.length <= 0) {
        this.setState({
          errorDescription: 'A descrição do tipo precisa ser preenchido.',
        });
        return false;
      } else {
        this.setState({ errorDescription: undefined });
        this.state.type.description = value;
        return true;
      }
    },
    axes: (value: string) => {
      if (value.length <= 0 || Number(value) <= 0) {
        this.setState({
          errorAxes: 'O número de eixos precisa ser preenchido.',
        });
        return false;
      } else {
        this.setState({
          errorAxes: undefined,
        });
        this.state.type.axes = Number(value);
        return true;
      }
    },
    capacity: (value: string) => {
      if (value.length <= 0) {
        this.setState({
          errorCapacity: 'A capacidade precisa ser preenchida.',
        });
        return false;
      } else {
        this.setState({
          errorCapacity: undefined,
        });
        this.state.type.capacity = Number(value);
        return true;
      }
    },
  };

  validateFields = () => {
    const { description, axes, capacity } = this.state;
    const desc = this.validate.description(description);
    const axs = this.validate.axes(axes.toString());
    const cap = this.validate.capacity(capacity);

    return desc && axs && cap;
  };

  clearFields = () => {
    this.setState({ description: '', axes: 0, capacity: '' });
  };

  persistData = async () => {
    const { type } = this.state;
    if (this.validateFields()) {
      if (this.method == 'novo') {
        if (await type.save()) this.clearFields();
      } else await type.update();
    }
  };

  render() {
    const { description, axes, capacity, errorDescription, errorAxes, errorCapacity } =
      this.state;

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo'
              ? 'Cadastrar Novo Tipo de Caminhão'
              : 'Detalhes do Tipo de Caminhão'
          }
        />
        <FieldsetCard legend="Dados do Tipo de Caminhão" obrigatoryFields>
          <Row>
            <FormInputText
              colSm={6}
              id="desc"
              label="Descrição"
              obrigatory
              value={description}
              onChange={(e) => {
                this.setState({ description: e.target.value });
                this.validate.description(e.target.value);
              }}
              message={errorDescription}
            />
            <FormInputNumber
              colSm={3}
              id="eixos"
              label="Eixos"
              obrigatory
              value={axes}
              onChange={(e) => {
                this.setState({ axes: Number.parseInt(e.target.value) });
                this.validate.axes(e.target.value);
              }}
              message={errorAxes}
            />
            <FormInputGroupText
              colSm={3}
              id="capacity"
              label="Capacidade"
              groupText={'KG'}
              obrigatory
              value={capacity}
              onChange={(e) => {
                this.setState({ capacity: e.target.value });
                this.validate.capacity(e.target.value);
              }}
              message={errorCapacity}
            />
          </Row>
        </FieldsetCard>
        <FormButtonsSave
          backLink="/tiposcaminhao"
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
  return <TruckType params={useParams()} />;
};
