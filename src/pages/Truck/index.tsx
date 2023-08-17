import React, { Component } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Row } from 'reactstrap';
import { Params, useParams } from 'react-router-dom';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { Truck as TruckModel } from '../../models/Truck';
import { ITruckType, TruckType } from '../../models/TruckType';
import { IProprietary, Proprietary } from '../../models/Proprietary';
import { IndividualPerson } from '../../models/IndividualPerson';
import { EnterprisePerson } from '../../models/EnterprisePerson';

interface IComponentProps {
  params: Readonly<Params<string>>;
}

interface IComponentState {
  truck: TruckModel;
  types: ITruckType[];
  proprietaries: IProprietary[];
  plate: string;
  brand: string;
  model: string;
  color: string;
  manufactureYear: string;
  modelYear: string;
  type: string;
  proprietary: string;
  errorPlate?: string;
  errorBrand?: string;
  errorModel?: string;
  errorColor?: string;
  errorManufactureYear?: string;
  errorModelYear?: string;
  errorType?: string;
  errorProprietary?: string;
}

class Truck extends Component<IComponentProps, IComponentState> {
  private id: number;
  private method: string;

  constructor(props: IComponentProps) {
    super(props);

    this.method = props.params.method as string;
    this.id = 0;
    if (props.params.id) this.id = Number.parseInt(props.params.id);

    this.state = {
      truck: new TruckModel(),
      types: [],
      proprietaries: [],
      plate: '',
      brand: '',
      model: '',
      color: '',
      manufactureYear: '',
      modelYear: '',
      type: '0',
      proprietary: '0',
    };
  }

  getTypes = async () => {
    const data = await new TruckType().get();
    this.setState({ types: data });
  };

  getProprietaries = async () => {
    const data = await new Proprietary().get();
    this.setState({ proprietaries: data });
  };

  getData = async () => {
    const truck = await new TruckModel().getOne(this.id);
    if (truck) {
      this.setState({
        truck,
        plate: truck.plate,
        brand: truck.brand,
        model: truck.model,
        color: truck.color,
        manufactureYear: truck.manufactureYear.toString(),
        modelYear: truck.modelYear.toString(),
        type: truck.type.id.toString(),
        proprietary: truck.proprietary.id.toString(),
      });
    }
  };

  async componentDidMount() {
    await this.getTypes();
    await this.getProprietaries();
    if (this.method == 'editar') await this.getData();
  }

  validate = {
    plate: (value: string) => {
      if (value.length <= 0) {
        this.setState({ errorPlate: 'A placa do caminhão precisa ser preenchida.' });
        return false;
      } else if (value.length < 8) {
        this.setState({ errorPlate: 'A placa do caminhão é inválida.' });
        return false;
      } else {
        this.setState({ errorPlate: undefined });
        this.state.truck.plate = value;
        return true;
      }
    },
    brand: (value: string) => {
      if (value.length <= 0) {
        this.setState({ errorBrand: 'A marca do caminhão precisa ser preenchida.' });
        return false;
      } else if (value.length < 3) {
        this.setState({ errorBrand: 'A marca do caminhão é inválida.' });
        return false;
      } else {
        this.setState({ errorBrand: undefined });
        this.state.truck.brand = value;
        return true;
      }
    },
    model: (value: string) => {
      if (value.length <= 0) {
        this.setState({ errorModel: 'O modelo do caminhão precisa ser preenchido.' });
        return false;
      } else if (value.length < 2) {
        this.setState({ errorModel: 'O modelo do caminhão é inválido.' });
        return false;
      } else {
        this.setState({ errorModel: undefined });
        this.state.truck.model = value;
        return true;
      }
    },
    color: (value: string) => {
      if (value.length <= 0) {
        this.setState({ errorColor: 'A cor do caminhão precisa ser preenchida.' });
        return false;
      } else if (value.length < 3) {
        this.setState({ errorColor: 'A cor do caminhão é inválida.' });
        return false;
      } else {
        this.setState({ errorColor: undefined });
        this.state.truck.color = value;
        return true;
      }
    },
    manufactureYear: (value: string) => {
      if (Number(value) < 1980) {
        this.setState({
          errorManufactureYear: 'O ano de fabricação do caminhão é inválida.',
        });
        return false;
      } else {
        this.setState({ errorManufactureYear: undefined });
        this.state.truck.manufactureYear = Number(value);
        return true;
      }
    },
    modelYear: (value: string) => {
      if (Number(value) < 1980) {
        this.setState({ errorModelYear: 'O ano do modelo do caminhão é inválida.' });
        return false;
      } else {
        this.setState({ errorModelYear: undefined });
        this.state.truck.modelYear = Number(value);
        return true;
      }
    },
    type: (value: string) => {
      if (value == '0') {
        this.setState({ errorType: 'O tipo de caminhão precisa ser selecionado.' });
        return false;
      } else {
        this.setState({ errorType: undefined });
        this.state.truck.type = this.state.types.find(
          (item) => item.id == Number(value),
        ) as TruckType;
        return true;
      }
    },
    proprietary: (value: string) => {
      if (value == '0') {
        this.setState({
          errorProprietary: 'O proprietário do caminhão precisa ser selecionado.',
        });
        return false;
      } else {
        this.setState({ errorProprietary: undefined });
        this.state.truck.proprietary = this.state.proprietaries.find(
          (item) => item.id == Number(value),
        ) as Proprietary;
        return true;
      }
    },
  };

  validateFields = () => {
    const { plate, brand, model, color, manufactureYear, modelYear, type, proprietary } =
      this.state;
    return (
      this.validate.plate(plate) &&
      this.validate.brand(brand) &&
      this.validate.model(model) &&
      this.validate.color(color) &&
      this.validate.manufactureYear(manufactureYear) &&
      this.validate.modelYear(modelYear) &&
      this.validate.type(type) &&
      this.validate.proprietary(proprietary)
    );
  };

  clearFields = () => {
    this.setState({
      plate: '',
      brand: '',
      model: '',
      color: '',
      manufactureYear: '',
      modelYear: '',
      type: '0',
      proprietary: '0',
    });
  };

  persistData = async () => {
    const { truck } = this.state;
    if (this.validateFields()) {
      if (this.method == 'novo') {
        if (await truck.save()) this.clearFields();
      } else await truck.update();
    }
  };

  render() {
    const {
      types,
      proprietaries,
      plate,
      brand,
      model,
      color,
      manufactureYear,
      modelYear,
      type,
      proprietary,
      errorPlate,
      errorBrand,
      errorModel,
      errorColor,
      errorManufactureYear,
      errorModelYear,
      errorType,
      errorProprietary,
    } = this.state;

    return (
      <>
        <CardTitle
          text={
            this.method == 'novo' ? 'Cadastrar Novo Caminhão' : 'Detalhes do Caminhão'
          }
        />
        <FieldsetCard legend="Dados do Caminhão" obrigatoryFields>
          <Row>
            <FormInputText
              colSm={2}
              id="placa"
              label="Placa"
              mask="SSS 0A00"
              obrigatory
              value={plate}
              onChange={(e) => {
                this.setState({ plate: e.target.value.toUpperCase() });
                this.validate.plate(e.target.value);
              }}
              message={errorPlate}
            />
            <FormInputText
              colSm={3}
              id="marca"
              label="Marca"
              obrigatory
              value={brand}
              onChange={(e) => {
                this.setState({ brand: e.target.value });
                this.validate.brand(e.target.value);
              }}
              message={errorBrand}
            />
            <FormInputText
              colSm={4}
              id="modelo"
              label="Modelo"
              obrigatory
              value={model}
              onChange={(e) => {
                this.setState({ model: e.target.value });
                this.validate.model(e.target.value);
              }}
              message={errorModel}
            />
            <FormInputText
              colSm={3}
              id="cor"
              label="Cor"
              obrigatory
              value={color}
              onChange={(e) => {
                this.setState({ color: e.target.value });
                this.validate.color(e.target.value);
              }}
              message={errorColor}
            />
          </Row>
          <Row>
            <FormInputText
              colSm={2}
              id="ano-fabricacao"
              label="Ano Fabricação"
              mask="0000"
              obrigatory
              value={manufactureYear}
              onChange={(e) => {
                this.setState({ manufactureYear: e.target.value });
                this.validate.manufactureYear(e.target.value);
              }}
              message={errorManufactureYear}
            />
            <FormInputText
              colSm={2}
              id="ano-modelo"
              label="Ano Modelo"
              mask="0000"
              obrigatory
              value={modelYear}
              onChange={(e) => {
                this.setState({ modelYear: e.target.value });
                this.validate.modelYear(e.target.value);
              }}
              message={errorModelYear}
            />
            <FormInputSelect
              colSm={3}
              id="tipo"
              label="Tipo"
              obrigatory
              value={type}
              onChange={(e) => {
                this.setState({ type: e.target.value });
                this.validate.type(e.target.value);
              }}
              message={errorType}
            >
              <option value="0">SELECIONE</option>
              {types.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.description} - {item.axes} Eixos
                </option>
              ))}
            </FormInputSelect>
            <FormInputSelect
              colSm={5}
              id="proprietario"
              label="Proprietário"
              obrigatory
              value={proprietary}
              onChange={(e) => {
                this.setState({ proprietary: e.target.value });
                this.validate.proprietary(e.target.value);
              }}
              message={errorProprietary}
            >
              <option value="0">SELECIONE</option>
              {proprietaries.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.person.type == 1
                    ? (item.person.individual as IndividualPerson).name
                    : (item.person.enterprise as EnterprisePerson).fantasyName}
                </option>
              ))}
            </FormInputSelect>
          </Row>
        </FieldsetCard>
        <FormButtonsSave
          backLink="/caminhoes"
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
  return <Truck params={useParams()} />;
};
