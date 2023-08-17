import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Badge, Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputDate } from '../../components/form-input-date';
import { FormInputNumber } from '../../components/form-input-number';
import { FormButton } from '../../components/form-button';
import { FormInputGroupNumber } from '../../components/form-input-group-number';
import { FreightOrder as FreightOrderModel } from '../../models/FreightOrder';
import { FreightBudget, IFreightBudget } from '../../models/FreightBudget';
import { ISaleOrder, SaleOrder } from '../../models/SaleOrder';
import { ICity } from '../../models/City';
import { Client, IClient } from '../../models/Client';
import { IPaymentForm, PaymentForm } from '../../models/PaymentForm';
import { IProduct, Product } from '../../models/Product';
import { IRepresentation, Representation } from '../../models/Representation';
import { IState } from '../../models/State';
import { IProprietary, Proprietary } from '../../models/Proprietary';
import { ITruckType } from '../../models/TruckType';
import { ITruck, Truck } from '../../models/Truck';
import { Driver, IDriver } from '../../models/Driver';
import axios from '../../services/axios';
import { toast } from 'react-toastify';
import history from '../../services/history';
import { formatarDataIso, formatarPeso, formatarValor } from '../../utils/format';
import { useParams } from 'react-router-dom';
import { IFreightItem } from '../../models/FreightItem';
import { FaTrash } from 'react-icons/fa';
import { calculateMinimumFloor } from '../../utils/calc';
import { ILoadStep } from '../../models/LoadStep';

export function FreightOrder(): JSX.Element {
  const [order, setOrder] = useState(new FreightOrderModel());

  const [budgets, setBudgets] = useState(new Array<IFreightBudget>());
  const [sales, setSales] = useState(new Array<ISaleOrder>());
  const [clients, setClients] = useState(new Array<IClient>());
  const [states, setStates] = useState(new Array<IState>());
  const [cities, setCities] = useState(new Array<ICity>());

  const [representations, setRepresentations] = useState(new Array<IRepresentation>());
  const [representationsDb, setRepresentationsDb] = useState(
    new Array<IRepresentation>(),
  );
  const [products, setProducts] = useState(new Array<IProduct>());
  const [productsDb, setProductsDb] = useState(new Array<IProduct>());

  const [steps, setSteps] = useState(new Array<ILoadStep>());

  const [paymentForms, setPaymentForms] = useState(new Array<IPaymentForm>());
  const [proprietaries, setProprietaries] = useState(new Array<IProprietary>());
  const [drivers, setDrivers] = useState(new Array<IDriver>());
  const [truckTypes, setTruckTypes] = useState(new Array<ITruckType>());
  const [trucks, setTrucks] = useState(new Array<ITruck>());
  const [trucksDb, setTrucksDb] = useState(new Array<ITruck>());

  const [budget, setBudget] = useState('0');
  const [sale, setSale] = useState('0');
  const [representation, setRepresentation] = useState('0');
  const [description, setDescription] = useState('');
  const [errorDescription, setErrorDescription] = useState<string | undefined>(undefined);
  const [client, setClient] = useState('0');
  const [errorClient, setErrorClient] = useState<string | undefined>(undefined);

  const [truckType, setTruckType] = useState('0');
  const [errorTruckType, setErrorTruckType] = useState<string | undefined>(undefined);
  const [proprietary, setProprietary] = useState('0');
  const [errorProprietary, setErrorProprietary] = useState<string | undefined>(undefined);
  const [truck, setTruck] = useState('0');
  const [errorTruck, setErrorTruck] = useState<string | undefined>(undefined);
  const [distance, setDistance] = useState(1);
  const [errorDistance, setErrorDistance] = useState<string | undefined>(undefined);

  const [destinyState, setDestinyState] = useState('0');
  const [errorDestinyState, setErrorDestinyState] = useState<string | undefined>(
    undefined,
  );
  const [destinyCity, setDestinyCity] = useState('0');
  const [errorDestinyCity, setErrorDestinyCity] = useState<string | undefined>(undefined);

  const [driver, setDriver] = useState('0');
  const [errorDriver, setErrorDriver] = useState<string | undefined>(undefined);
  const [driverAmount, setDriverAmount] = useState('');
  const [errorDriverAmount, setErrorDriverAmount] = useState<string | undefined>(
    undefined,
  );
  const [driverAmountEntry, setDriverAmountEntry] = useState('');
  const [driverForm, setDriverForm] = useState('0');

  const [weight, setWeight] = useState('');
  const [errorWeight, setErrorWeight] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState('');
  const [errorPrice, setErrorPrice] = useState<string | undefined>(undefined);
  const [shipping, setShipping] = useState(new Date().toISOString().substring(0, 10));
  const [errorShipping, setErrorShipping] = useState<string | undefined>(undefined);
  const [form, setForm] = useState('0');
  const [errorForm, setErrorForm] = useState<string | undefined>(undefined);

  const [minimumFloor, setMinimumFloor] = useState(0);

  const routeParams = useParams();
  const method = routeParams.method as string;
  let id = 0;
  if (routeParams.id) id = Number.parseInt(routeParams.id);

  useEffect(() => {
    const getBudgets = async () => {
      const response = await new FreightBudget().get();
      setBudgets(response);
    };

    const getSales = async () => {
      const response = await new SaleOrder().get();
      setSales(response);
    };

    const getStates = async () => {
      const response = await axios.get('/state');
      setStates(response.data);
      return response.data;
    };

    const getClients = async () => {
      const response = await new Client().get();
      setClients(response);
    };

    const getRepresentations = async (products: Product[]) => {
      const response = await new Representation().get();
      if (response.length == 0) {
        toast.info('Não há representações cadastradas.');
        history.push('/representacoes');
        window.location.reload();
      }
      setRepresentationsDb(response);
      setRepresentations(response);

      setItemRepresentation(response[0].id.toString());
      let newProducts = [...products];
      newProducts = newProducts.filter(
        (item) => item.representation.id == response[0].id,
      );
      setProducts(newProducts);
      if (newProducts.length > 0) {
        setItem(newProducts[0].id.toString());
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as Product;
        setItemWeight(formatarPeso(product.weight));
        setItemQuantity(1);
        setTotalItemWeight(formatarPeso(product.weight * itemQuantity));
      }
    };

    const getProducts = async () => {
      const response = await new Product().get();
      if (response.length == 0) {
        toast.info('Não há produtos cadastrados.');
        history.push('/produtos');
        window.location.reload();
      }
      setProductsDb(response);
      return response;
    };

    const getDrivers = async () => {
      const response = await new Driver().get();
      setDrivers(response);
    };

    const getProprietaries = async () => {
      const response = await new Proprietary().get();
      setProprietaries(response);
    };

    const getTrucks = async () => {
      const response = await new Truck().get();
      setTrucksDb(response);
      setTrucks(response);
    };

    const getPaymentForms = async () => {
      const response = (await new PaymentForm().get()).filter((item) => item.link == 2);
      setPaymentForms(response);
    };
    const getData = async (states: IState[]) => {
      const order = await new FreightOrderModel().getOne(id);
      if (order) {
        setOrder(order);

        setDescription(order.description);
        setBudget(order.budget ? order.budget.id.toString() : '0');
        setSale(order.saleOrder ? order.saleOrder.id.toString() : '0');
        setRepresentation(
          order.representation ? order.representation.id.toString() : '0',
        );
        setClient(order.client.id.toString());
        setDestinyState(order.destiny.state.id.toString());
        setCities(states[order.destiny.state.id - 1].cities);
        setDestinyCity(order.destiny.id.toString());
        setTruckType(order.truckType.id.toString());
        setProprietary(order.proprietary.id.toString());
        setTruck(order.truck.id.toString());
        setDistance(order.distance);
        setDriver(order.driver.id.toString());
        setDriverAmount(formatarValor(order.driverValue));
        setDriverAmountEntry(formatarValor(order.driverEntry));
        setDriverForm(
          order.paymentFormDriver ? order.paymentFormDriver.id.toString() : '0',
        );

        setWeight(formatarPeso(order.weight));
        setPrice(formatarValor(order.value));
        setForm(order.paymentFormFreight.id.toString());
        setShipping(formatarDataIso(order.shipping));

        setItems(order.items);
        const newTypes: ITruckType[] = [];
        for (const item of order.items) {
          for (const t of item.product.types) {
            const exists = newTypes.find((i) => i.id == t.id);
            if (!exists) newTypes.push(t);
          }
        }
        setTruckTypes(newTypes);
        setSteps(order.steps);
      }
    };

    const load = async () => {
      await getBudgets();
      await getSales();
      await getClients();
      await getRepresentations(await getProducts());
      await getDrivers();
      await getProprietaries();
      await getTrucks();
      await getPaymentForms();
      if (method == 'detalhes') await getData(await getStates());
      else await getStates();
    };

    load();
  }, []);

  const validate = {
    description: (value: string) => {
      if (value.length == 0) {
        setErrorDescription('A descrição do orçamento precisa ser preenchida.');
        return false;
      } else if (value.length < 2) {
        setErrorDescription('A descrição preenchida tem tamanho inválido.');
        return false;
      } else {
        setErrorDescription(undefined);
        order.description = value;
        return true;
      }
    },
    client: (value: string) => {
      if (value == '0') {
        setErrorClient('O cliente precisa ser selecionado.');
        return false;
      } else {
        setErrorClient(undefined);
        order.client = (
          clients.find((item) => item.id == Number(value)) as Client
        ).toAttributes;
        return true;
      }
    },
    destinyState: (value: string) => {
      if (value == '0') {
        setErrorDestinyState('O Estado precisa ser selecionado');
        return false;
      } else {
        setErrorDestinyState(undefined);
        setCities(states[Number(value) - 1].cities);
        return true;
      }
    },
    destinyCity: (value: string) => {
      if (value == '0') {
        setErrorDestinyCity('A cidade precisa ser selecionada');
        return false;
      } else {
        setErrorDestinyCity(undefined);
        const city = cities.find((item) => item.id == Number(value)) as ICity;
        order.destiny = city;
        return true;
      }
    },
    type: (value: string) => {
      if (value == '0') {
        setErrorTruckType('O tipo de caminhão precisa ser selecionado.');
        return false;
      } else {
        setErrorTruckType(undefined);
        const t = truckTypes.find((item) => item.id == Number(value)) as ITruckType;

        if (
          Number.parseFloat(
            order.weight
              .toString()
              .replace(',', '#')
              .replaceAll('.', ',')
              .replace('#', '.'),
          ) > t.capacity
        ) {
          setErrorTruckType('O tipo de caminhão não suporta a carga.');
          return false;
        }

        order.truckType = t;
        return true;
      }
    },
    proprietary: (value: string) => {
      if (value == '0') {
        setErrorProprietary('O proprietário do caminhão precisa ser selecionado.');
        return false;
      } else {
        setErrorProprietary(undefined);
        order.proprietary = (
          proprietaries.find((item) => item.id == Number(value)) as Proprietary
        ).toAttributes;
        if (order.proprietary.driver) setDriver(order.proprietary.driver.id.toString());
        let newTrucks = [...trucksDb];
        newTrucks = newTrucks.filter(
          (item) =>
            item.proprietary.id == Number(value) && item.type.id == Number(truckType),
        );
        setTrucks(newTrucks);
        return true;
      }
    },
    truck: (value: string) => {
      if (value == '0') {
        setErrorTruck('O caminhão precisa ser selecionado.');
        return false;
      } else {
        setErrorTruck(undefined);

        order.truck = trucks.find((item) => item.id == Number(value)) as ITruck;
        console.log(order.truck, value);

        return true;
      }
    },
    distance: (value: string) => {
      const v = Number(value);
      if (Number.isNaN(v)) {
        setErrorDistance('A distância do frete precisa ser preenchida.');
        return false;
      } else if (v <= 0) {
        setErrorDistance('A distância preenchida é inválida.');
        return false;
      } else if (truckType == '0') {
        setErrorDistance('o Tipo de caminhão precisa ser selecionado primeiro.');
        return false;
      } else {
        setErrorDistance(undefined);

        const t = truckTypes.find((x) => x.id == Number(truckType)) as ITruckType;
        const piso = t.axes > 3 ? calculateMinimumFloor(Number(value), t.axes) : 1.0;
        setPrice(formatarValor(piso));
        setMinimumFloor(piso);

        order.distance = v;
        if (order.value < piso) order.value = piso;
        return true;
      }
    },
    driver: (value: string) => {
      if (value == '0') {
        setErrorDriver('O motorista precisa ser selecionado.');
        return false;
      } else {
        setErrorDriver(undefined);
        order.driver = (
          drivers.find((item) => item.id == Number(value)) as Driver
        ).toAttributes;
        return true;
      }
    },
    driverAmount: (value: string) => {
      if (value.length == 0) {
        setErrorDriverAmount('O valor do motorista precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) < 1
      ) {
        setErrorDriverAmount('O valor do motorista informado é inválido.');
        return false;
      } else {
        setErrorDriverAmount(undefined);
        order.driverValue = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    weight: (value: string) => {
      if (value.length == 0) {
        setErrorWeight('O peso do frete precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorWeight('O peso do frete informado é inválido.');
        return false;
      } else {
        setErrorWeight(undefined);
        order.weight = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    price: (value: string) => {
      if (value.length == 0) {
        setErrorPrice('O preço do frete precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) < minimumFloor
      ) {
        setErrorPrice('O preço do frete informado é inválido ou abaixo do piso.');
        return false;
      } else {
        setErrorPrice(undefined);
        order.value = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    shipping: (value: string) => {
      const val = new Date(value + 'T12:00:00');
      const now = new Date(Date.now());
      if (value.length == 0) {
        setErrorShipping('A data de entrega precisa ser preenchida');
        return false;
      } else if (
        now.getFullYear() == val.getFullYear() &&
        now.getMonth() == val.getMonth() &&
        now.getDate() > val.getDate()
      ) {
        setErrorShipping('A data de entrega preenchida é inválida');
        return false;
      } else {
        setErrorShipping(undefined);
        order.shipping = value;
        return true;
      }
    },
    form: (value: string) => {
      if (value == '0') {
        setErrorForm('A forma de pagamento precisa ser selecionada.');
        return false;
      } else {
        setErrorForm(undefined);
        order.paymentFormFreight = (
          paymentForms.find((item) => item.id == Number(value)) as PaymentForm
        ).toAttributes;
        return true;
      }
    },
    items: () => {
      if (items.length == 0) {
        toast.info('Não há itens adicionados ao pedido.');
        return false;
      } else {
        order.items = filterItems();
        order.steps = filterSteps();
        return true;
      }
    },
    itemRepresentation: (value: string) => {
      if (value == '0') {
        setErrorItemRepresentation('A representação do item precisa ser selecionada.');
        return false;
      } else {
        setErrorItemRepresentation(undefined);
        setItemFilter('');
        if (representations.length > 0) {
          let newProducts = [...productsDb];
          const representation = representations.find(
            (i) => i.id == Number(value),
          ) as Representation;
          newProducts = newProducts.filter(
            (item) => item.representation.id == representation.id,
          );
          setProducts(newProducts);
          if (newProducts.length > 0) {
            setItem(newProducts[0].id.toString());
            const product = newProducts.find(
              (item) => item.id == newProducts[0].id,
            ) as Product;
            setItemWeight(formatarPeso(product.weight));
            setItemQuantity(1);
            setTotalItemWeight(formatarPeso(product.weight * itemQuantity));
          }
        }
        return true;
      }
    },
    item: (value: string) => {
      if (value == '0' || products.length == 0) {
        setErrorItem('O item precisa ser selecionado.');
        return false;
      } else {
        const product = products.find((item) => item.id == Number(value)) as Product;
        const itemProduct = items.find((i) => i.product.id == product.id);
        if (itemProduct) {
          setErrorItem('Este item já foi adicionado.');
          return false;
        } else {
          let typesCommon = 0;
          product.types.forEach((x) => {
            truckTypes.forEach((y) => {
              if (x.id == y.id) typesCommon++;
            });
          });

          if (items.length > 0 && typesCommon == 0) {
            setErrorTruckType(
              'Este produto não pode ser carregado junto os outros já adicionados.',
            );
            return false;
          }

          setErrorItem(undefined);

          setItemWeight(formatarPeso(product.weight));
          setItemQuantity(1);
          setTotalItemWeight(formatarPeso(product.weight * itemQuantity));
          return true;
        }
      }
    },
    itemWeight: (value: string) => {
      if (value.length == 0) {
        setErrorItemWeight('O peso do item precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorItemWeight('O peso do item informado é inválido.');
        return false;
      } else {
        setErrorItemWeight(undefined);
        return true;
      }
    },
    itemQuantity: (value: string) => {
      const val = Number(value);
      if (val <= 0) {
        setErrorItemQuantity('A quantidade do item precisa ser preenchida.');
        return false;
      } else {
        setErrorItemQuantity(undefined);
        //const product = products.find((i) => i.id == Number(item)) as Product;
        const weight = Number.parseFloat(
          itemWeight.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        setTotalItemWeight(formatarValor(weight * val));
        return true;
      }
    },
    totalItemWeight: (value: string) => {
      if (value.length == 0) {
        setErrorTotalItemWeight('O peso total do item precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorTotalItemWeight('O peso total do item informado é inválido.');
        return false;
      } else {
        setErrorTotalItemWeight(undefined);
        return true;
      }
    },
  };

  const fillFieldsSale = async (saleId: number) => {
    const sale = (await new SaleOrder().getOne(saleId)) as SaleOrder;
    setBudget('0');
    order.budget = undefined;
    setRepresentation('0');
    order.representation = undefined;
    setDescription(sale.description);
    setClient(sale.client ? sale.client.id.toString() : '0');
    setDestinyState(sale.destiny.state.id.toString());
    setCities(states[sale.destiny.state.id - 1].cities);
    setDestinyCity(sale.destiny.id.toString());

    const newTypes: ITruckType[] = [];
    const newItems: IFreightItem[] = [];
    const newSteps: ILoadStep[] = [];
    for (const item of sale.items) {
      newItems.push({
        id: 0,
        product: item.product,
        quantity: item.quantity,
        weight: item.weight,
        order: order.toAttributes,
      });
      for (const t of item.product.types) {
        const exists = newTypes.find((i) => i.id == t.id);
        if (!exists) newTypes.push(t);
      }
      const loadStep = steps.find(
        (step) => step.representation.id == item.product.representation.id,
      );
      if (loadStep != undefined) {
        loadStep.load += item.weight;
      } else {
        newSteps.push({
          id: 0,
          order: newSteps.length + 1,
          load: item.weight,
          status: 1,
          representation: item.product.representation,
          freightOrder: order.toAttributes,
        });
      }
    }
    setItems(newItems);
    setSteps(newSteps);
    setTruckTypes(newTypes);
    order.weight = sale.toAttributes.weight;
    setWeight(formatarValor(sale.toAttributes.weight));
    order.saleOrder = sale.toAttributes;
  };

  const fillFieldsBudget = async (saleId: number) => {
    const budget = (await new FreightBudget().getOne(saleId)) as FreightBudget;
    setSale('0');
    order.saleOrder = undefined;
    setRepresentation('0');
    order.representation = undefined;
    setDescription(budget.description);
    setClient(budget.client ? budget.client.id.toString() : '0');
    setDestinyState(budget.destiny.state.id.toString());
    setCities(states[budget.destiny.state.id - 1].cities);
    setDestinyCity(budget.destiny.id.toString());

    const newTypes: ITruckType[] = [];
    const newItems: IFreightItem[] = [];
    const newSteps: ILoadStep[] = [];
    for (const item of budget.items) {
      item.id = 0;
      item.budget = undefined;
      item.order = order.toAttributes;
      newItems.push(item);
      for (const t of item.product.types) {
        const exists = newTypes.find((i) => i.id == t.id);
        if (!exists) newTypes.push(t);
      }
      const loadStep = steps.find(
        (step) => step.representation.id == item.product.representation.id,
      );
      if (loadStep != undefined) {
        loadStep.load += item.weight;
      } else {
        newSteps.push({
          id: 0,
          order: newSteps.length + 1,
          load: item.weight,
          status: 1,
          representation: item.product.representation,
          freightOrder: order.toAttributes,
        });
      }
    }
    setItems(newItems);
    setSteps(newSteps);
    setTruckTypes(newTypes);
    order.truckType = budget.truckType;
    setTruckType(budget.truckType.id.toString());
    order.distance = budget.distance;
    setDistance(budget.distance);
    order.weight = budget.toAttributes.weight;
    setWeight(formatarPeso(budget.toAttributes.weight));
    order.value = budget.value;
    setPrice(formatarValor(budget.value));
    order.shipping = budget.shipping;
    setShipping(budget.shipping);
    order.budget = budget.toAttributes;
  };

  //const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};

  const handleBudgetChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value);
    if (e.target.value != '0') {
      await fillFieldsBudget(Number(e.target.value));
    } else {
      setDescription('');
      setClient('0');
      setDestinyState('0');
      setDestinyCity('0');
      setItems([]);
      setTruckType('0');
      setDistance(0);
      setWeight('');
      setPrice('');
      setShipping('');
      setTruckTypes([]);
      setSteps([]);
      order.budget = undefined;
    }
  };
  const handleSaleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSale(e.target.value);
    if (e.target.value != '0') {
      await fillFieldsSale(Number(e.target.value));
    } else {
      setDescription('');
      setClient('0');
      setDestinyState('0');
      setDestinyCity('0');
      setItems([]);
      setWeight('');
      setTruckTypes([]);
      setSteps([]);
      order.saleOrder = undefined;
    }
  };
  const handleRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRepresentation(e.target.value);
    if (e.target.value != '0') {
      setItemRepresentation(e.target.value);
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) => item.representation.id == Number(e.target.value),
      );
      setProducts(newProducts);
      if (newProducts.length > 0) {
        setItem(newProducts[0].id.toString());
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as IProduct;
        setItemWeight(formatarPeso(product.weight));
        setItemQuantity(1);
        setTotalItemWeight(formatarValor(product.weight * itemQuantity));
      }
      const r = representations.find(
        (x) => x.id == Number(e.target.value),
      ) as Representation;
      order.representation = r.toAttributes;
      setItems([]);
      setSteps([]);
      setWeight('');
      setPrice('');
      setSale('0');
      setBudget('0');
      setClient('0');
      setDestinyState('0');
      setDestinyCity('0');
      setTruckTypes([]);
      order.saleOrder = undefined;
    } else order.representation = undefined;
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    validate.description(e.target.value);
  };
  const handleClientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClient(e.target.value);
    validate.client(e.target.value);
  };

  const handleClearItemsClick = () => {
    setItems([]);
    setWeight('');
    setPrice('');
    setTruckTypes([]);
    setSteps([]);
  };

  const [addItems, setAddItems] = useState(false);

  const handleTruckTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTruckType(e.target.value);
    validate.type(e.target.value);
  };
  const handleProprietaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProprietary(e.target.value);
    validate.proprietary(e.target.value);
  };
  const handleTruckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTruck(e.target.value);
    console.log(e.target.value);

    validate.truck(e.target.value);
  };
  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistance(Number.parseInt(e.target.value));
    validate.distance(e.target.value);
  };

  const handleDestinyStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestinyState(e.target.value);
    validate.destinyState(e.target.value);
  };
  const handleDestinyCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestinyCity(e.target.value);
    validate.destinyCity(e.target.value);
  };

  const handleDriverChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriver(e.target.value);
    validate.driver(e.target.value);
  };
  const handleDriverAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriverAmount(e.target.value);
    validate.driverAmount(e.target.value);
  };
  const handleDriverAmountEntryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriverAmountEntry(e.target.value);
    if (e.target.value.length > 0) {
      order.driverEntry = Number.parseFloat(
        e.target.value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
      );
    } else order.driverEntry = 0.0;
  };
  const handleDriverFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriverForm(e.target.value);
    if (e.target.value != '0') {
      order.paymentFormDriver = (
        paymentForms.find((item) => item.id == Number(e.target.value)) as PaymentForm
      ).toAttributes;
    } else order.paymentFormDriver = undefined;
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    validate.weight(e.target.value);
  };
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
    validate.price(e.target.value);
  };
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(e.target.value);
    validate.form(e.target.value);
  };
  const handleShippingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShipping(e.target.value);
    validate.shipping(e.target.value);
  };

  const validateFields = () => {
    return (
      validate.description(description) &&
      validate.client(client) &&
      validate.type(truckType) &&
      validate.proprietary(proprietary) &&
      validate.truck(truck) &&
      validate.distance(distance.toString()) &&
      validate.destinyState(destinyState) &&
      validate.destinyCity(destinyCity) &&
      validate.driver(driver) &&
      validate.driverAmount(driverAmount) &&
      validate.items() &&
      validate.weight(weight) &&
      validate.price(price) &&
      validate.shipping(shipping) &&
      validate.form(form)
    );
  };

  const clearFields = () => {
    setBudget('0');
    setSale('0');
    setRepresentation('0');
    setDescription('');
    setClient('0');
    setItems([]);
    clearItemFields();
    setSteps([]);
    setTruckType('0');
    setProprietary('0');
    setTruck('0');
    setDistance(1);
    setDestinyState('0');
    setDestinyCity('0');
    setDriver('0');
    setDriverAmount('');
    setDriverAmountEntry('');
    setDriverForm('0');
    setWeight('');
    setPrice('');
    setShipping('');
    setForm('0');
  };

  const persistData = async () => {
    if (validateFields()) {
      if (method == 'abrir') {
        if (await order.save()) clearFields();
      }
    }
  };

  const handleButtons = {
    handleClearClick: () => {
      clearFields();
    },
    handleSaveClick: async () => {
      await persistData();
    },
  };

  // Items
  const [items, setItems] = useState(new Array<IFreightItem>());
  const [itemRepresentation, setItemRepresentation] = useState('0');
  const [errorItemRepresentation, setErrorItemRepresentation] = useState<
    string | undefined
  >(undefined);
  const [itemRepresentationFilter, setItemRepresentationFilter] = useState('');
  const [item, setItem] = useState('0');
  const [errorItem, setErrorItem] = useState<string | undefined>(undefined);
  const [itemFilter, setItemFilter] = useState('');

  const [itemWeight, setItemWeight] = useState('');
  const [errorItemWeight, setErrorItemWeight] = useState<string | undefined>(undefined);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [errorItemQuantity, setErrorItemQuantity] = useState<string | undefined>(
    undefined,
  );
  const [totalItemWeight, setTotalItemWeight] = useState('');
  const [errorTotalItemWeight, setErrorTotalItemWeight] = useState<string | undefined>(
    undefined,
  );

  const handleItemRepresentationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemRepresentation(e.target.value);
    validate.itemRepresentation(e.target.value);
  };
  const handleItemRepresentationFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newRepresentations: IRepresentation[] = [];
    if (e.target.value.trim().length > 0) {
      clearItemFields();
      setItemRepresentationFilter(e.target.value);
      newRepresentations = [...representationsDb];
      newRepresentations = newRepresentations.filter(
        (item) =>
          item.person.enterprise?.fantasyName.includes(e.target.value) ||
          item.unity.includes(e.target.value),
      );
    } else {
      clearItemFields();
      setItemRepresentationFilter(e.target.value);
      newRepresentations = [...representationsDb];
    }
    setRepresentations(newRepresentations);
    if (newRepresentations.length > 0) {
      setItemFilter('');
      setItemRepresentation(newRepresentations[0].id.toString());
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) => item.representation.id == newRepresentations[0].id,
      );
      setProducts(newProducts);
      if (newProducts.length > 0) {
        setItem(newProducts[0].id.toString());
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as Product;
        setItemWeight(formatarValor(product.weight));
        setItemQuantity(1);
        setTotalItemWeight(formatarValor(product.weight * itemQuantity));
      }
    }
  };
  const handleItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItem(e.target.value);
    validate.item(e.target.value);
  };
  const handleItemFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemFilter(e.target.value);
    if (e.target.value.trim().length > 0) {
      setItemWeight('');
      setItemQuantity(1);
      setTotalItemWeight('');
      let newProducts = [...productsDb];
      newProducts = newProducts.filter(
        (item) =>
          item.representation.id == Number(itemRepresentation) &&
          item.description.includes(e.target.value),
      );
      setProducts(newProducts);
      if (newProducts.length > 0) {
        const product = newProducts.find(
          (item) => item.id == newProducts[0].id,
        ) as Product;
        setItem(product.id.toString());
        setItemWeight(formatarValor(product.weight));
        setItemQuantity(1);
        setTotalItemWeight(formatarValor(product.weight * itemQuantity));
      }
    }
  };

  const handleItemWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemWeight(e.target.value);
    validate.itemWeight(e.target.value);
  };
  const handleItemQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemQuantity(Number.parseInt(e.target.value));
    validate.itemQuantity(e.target.value);
  };
  const handleTotalItemWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTotalItemWeight(e.target.value);
    validate.totalItemWeight(e.target.value);
  };

  const clearItemFields = () => {
    setItemRepresentationFilter('');
    const newRepresentations = [...representationsDb];
    setRepresentations(newRepresentations);
    setItemFilter('');
    let newProducts = [...products];
    newProducts = newProducts.filter(
      (item) => item.representation.id == newRepresentations[0].id,
    );
    setProducts(newProducts);
    if (newProducts.length > 0) {
      setItem(newProducts[0].id.toString());
      const product = newProducts.find(
        (item) => item.id == newProducts[0].id,
      ) as IProduct;
      setItemWeight(formatarPeso(product.weight));
      setItemQuantity(1);
      setTotalItemWeight(formatarValor(product.weight * itemQuantity));
    }
    //setItems([]);
  };

  const validateItemFields = () => {
    return (
      validate.itemRepresentation(itemRepresentation) &&
      validate.item(item) &&
      validate.itemWeight(itemWeight) &&
      validate.itemQuantity(itemQuantity.toString()) &&
      validate.totalItemWeight(totalItemWeight)
    );
  };

  const handleClearItemClick = () => {
    clearItemFields();
  };
  const handleAddItemClick = () => {
    if (validateItemFields()) {
      const newItems = [...items];
      const product = (products.find((i) => i.id == Number(item)) as Product)
        .toAttributes;
      newItems.push({
        id: 0,
        product: product,
        quantity: itemQuantity,
        weight: product.weight * itemQuantity,
        order: order.toAttributes,
      });
      setItems(newItems);
      let totalWeight = 0.0;
      newItems.forEach((item) => (totalWeight += item.weight));
      const newTypes = [...truckTypes];
      for (const t of product.types) {
        const exists = newTypes.find((i) => i.id == t.id);
        if (!exists) newTypes.push(t);
      }
      totalWeight = Number(totalWeight.toString());
      setWeight(formatarValor(totalWeight));
      order.weight = totalWeight;
      setTruckTypes(newTypes);
      const loadStep = steps.find(
        (step) => step.representation.id == product.representation.id,
      );
      if (loadStep != undefined) {
        loadStep.load += product.weight * itemQuantity;
      } else {
        const newSteps = [...steps];
        newSteps.push({
          id: 0,
          order: newSteps.length + 1,
          load: product.weight * itemQuantity,
          status: 1,
          representation: product.representation,
          freightOrder: order.toAttributes,
        });
        setSteps(newSteps);
      }
    }
  };

  const filterItems = () => {
    if (truckType != '0') {
      const tmp = [...items];
      return tmp.filter(
        (i) => i.product.types.find((t) => t.id == Number(truckType)) != undefined,
      );
    }

    return items;
  };

  const filterSteps = () => {
    if (truckType != '0') {
      const tmp = [...steps];
      return tmp.filter(
        (s) =>
          filterItems().find((i) => i.product.representation.id == s.representation.id) !=
          undefined,
      );
    }

    return steps;
  };

  return (
    <>
      <CardTitle text={'Abrir Pedido de Frete'} />
      <FieldsetCard legend="Dados do Pedido" obrigatoryFields>
        <Row>
          <FormInputSelect
            colSm={4}
            id="orcamento-frete"
            label="Orçamento de frete"
            obrigatory={false}
            value={budget}
            onChange={handleBudgetChange}
            disable={sale != '0' || representation != '0' || method == 'detalhes'}
          >
            <option value="0">SELECIONE</option>
            {budgets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </FormInputSelect>
          <FormInputSelect
            colSm={4}
            id="pedido-venda"
            label="Pedido de venda"
            obrigatory={false}
            value={sale}
            onChange={handleSaleChange}
            disable={budget != '0' || representation != '0' || method == 'detalhes'}
          >
            <option value="0">SELECIONE</option>
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
            obrigatory
            value={representation}
            onChange={handleRepresentationChange}
            disable={budget != '0' || sale != '0' || method == 'detalhes'}
          >
            <option value="0">SELECIONE</option>
            {representationsDb.map((item) => (
              <option key={item.id} value={item.id}>
                {item.person.enterprise?.fantasyName + ' (' + item.unity + ')'}
              </option>
            ))}
          </FormInputSelect>
        </Row>
        <Row>
          <FormInputText
            colSm={7}
            id="desc"
            label="Descrição"
            obrigatory
            value={description}
            onChange={(e) => handleDescriptionChange(e)}
            message={errorDescription}
            readonly={method == 'detalhes'}
          />
          <FormInputSelect
            colSm={5}
            id="cliente"
            label="Cliente"
            obrigatory
            value={client}
            onChange={handleClientChange}
            message={errorClient}
            disable={method == 'detalhes'}
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
                <th>TOTAL (R$)</th>
                <th>&nbsp;</th>
              </tr>
            </thead>

            <tbody id="tbodyItens">
              {filterItems().map((item) => (
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
                      onClick={() => {
                        if (sale == '0' && budget == '0' && method == 'abrir') {
                          let newItems = [...items];
                          newItems = newItems.filter(
                            (i) => i.product.id != item.product.id,
                          );
                          setItems(newItems);
                          let totalWeight = 0.0;
                          newItems.forEach((item) => (totalWeight += item.weight));
                          totalWeight = Number(totalWeight.toString());
                          setWeight(formatarValor(totalWeight));
                          order.weight = totalWeight;
                          const newTypes: ITruckType[] = [];
                          newItems.forEach((i) => {
                            for (const t of i.product.types) {
                              const exists = newTypes.find((it) => it.id == t.id);
                              if (!exists) newTypes.push(t);
                            }
                          });
                          setTruckTypes(newTypes);
                          const loadStep = steps.find(
                            (step) =>
                              step.representation.id == item.product.representation.id,
                          );
                          if (loadStep != undefined && loadStep.load - item.weight > 0) {
                            loadStep.load -= item.weight;
                          } else {
                            let newSteps = [...steps];
                            newSteps = newSteps.filter(
                              (i) =>
                                i.representation.id != item.product.representation.id,
                            );
                            setSteps(newSteps);
                          }
                        }
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
              onClick={handleClearItemsClick}
              disabled={budget != '0' || sale != '0' || method == 'detalhes'}
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
              onClick={() => setAddItems(!addItems)}
              disabled={budget != '0' || sale != '0' || method == 'detalhes'}
            >
              {addItems ? 'CONCLUIR ADIÇÂO' : 'ADICIONAR ITENS'}
            </Button>
          </Col>
        </Row>
      </FieldsetCard>
      {addItems ? (
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
                  onChange={handleItemRepresentationFilterChange}
                  readOnly={representation != '0'}
                />
                <Input
                  type="select"
                  id="representacao-item"
                  bsSize="sm"
                  style={{ width: '100%' }}
                  value={itemRepresentation}
                  onChange={handleItemRepresentationChange}
                  disabled={representation != '0'}
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
                  onChange={handleItemFilterChange}
                />
                <Input
                  type="select"
                  id="item"
                  bsSize="sm"
                  style={{ width: '100%' }}
                  value={item}
                  onChange={handleItemChange}
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
              id="peso-produto"
              label="Peso"
              groupText={'KG'}
              obrigatory
              mask="##0,0"
              maskReversal={true}
              maskPlaceholder="0,0"
              value={itemWeight}
              onChange={handleItemWeightChange}
              message={errorItemWeight}
              readonly
            />
            <FormInputNumber
              colSm={2}
              id="quantidade-item"
              label="Qtde desejada"
              obrigatory
              value={itemQuantity}
              onChange={handleItemQuantityChange}
              message={errorItemQuantity}
            />
            <FormInputGroupText
              colSm={3}
              id="peso-total-item"
              label="Peso Total"
              groupText={'KG'}
              obrigatory
              mask="##0,0"
              maskReversal={true}
              maskPlaceholder="0,0"
              value={totalItemWeight}
              onChange={handleTotalItemWeightChange}
              message={errorTotalItemWeight}
              readonly
            />
            <FormButton
              colSm={2}
              color="primary"
              id="limpar-item"
              text="LIMPAR"
              onClick={handleClearItemClick}
            />
            <FormButton
              colSm={2}
              color="success"
              id="adicionar-item"
              text="ADICIONAR"
              onClick={handleAddItemClick}
            />
          </Row>
        </FieldsetCard>
      ) : (
        ''
      )}
      <FieldsetCard legend="Etapas de carregamento">
        <div className="table-container" style={{ height: '150px' }}>
          <Table id="load-steps" striped hover>
            <thead>
              <tr>
                <th>ORDEM</th>
                <th>REPRESENTAÇÃO</th>
                <th>CIDADE</th>
                <th>CARGA (Kg)</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody id="tbodySteps">
              {filterSteps().map((item) => (
                <tr key={item.representation.id}>
                  <td>{item.order}</td>
                  <td>{item.representation.person.enterprise?.fantasyName}</td>
                  <td>{item.representation.unity}</td>
                  <td>{item.load}</td>
                  <td>
                    {item.status == 1
                      ? 'PENDENTE'
                      : item.status == 2
                      ? 'AUTORIZADO'
                      : 'CARREGADO'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </FieldsetCard>
      <FieldsetCard legend="Dados do transporte" obrigatoryFields>
        <Row>
          <FormInputSelect
            colSm={3}
            id="truck-type"
            label="Tipo Caminhão"
            obrigatory
            value={truckType}
            onChange={handleTruckTypeChange}
            message={errorTruckType}
            disable={method == 'detalhes'}
          >
            <option value="0">SELECIONAR</option>
            {truckTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.description + ' - ' + item.axes + ' EIXOS'}
              </option>
            ))}
          </FormInputSelect>
          <FormInputSelect
            colSm={3}
            id="proprietario"
            label="Proprietário Caminhão"
            obrigatory
            value={proprietary}
            onChange={handleProprietaryChange}
            message={errorProprietary}
            disable={method == 'detalhes'}
          >
            <option value="0">SELECIONE</option>
            {proprietaries.map((item) => (
              <option key={item.id} value={item.id}>
                {item.person.type == 1
                  ? item.person.individual?.name
                  : item.person.enterprise?.fantasyName}
              </option>
            ))}
          </FormInputSelect>
          <FormInputSelect
            colSm={3}
            id="caminhao"
            label="Caminhão"
            obrigatory
            value={truck}
            onChange={handleTruckChange}
            message={errorTruck}
            disable={method == 'detalhes'}
          >
            <option value="0">SELECIONE</option>
            {trucks.map((item) => (
              <option key={item.id} value={item.id}>
                {item.brand + ' ' + item.model}
              </option>
            ))}
          </FormInputSelect>
          <FormInputGroupNumber
            colSm={3}
            id="distancia"
            label="Distância"
            groupText={'KM'}
            obrigatory
            value={distance}
            onChange={handleDistanceChange}
            message={errorDistance}
            readonly={method == 'detalhes'}
          />
        </Row>
      </FieldsetCard>
      <Row>
        <Col sm="4">
          <FieldsetCard legend="Destino" obrigatoryFields>
            <Row>
              <FormInputSelect
                colSm={12}
                id="estado-destino"
                label="Estado de destino"
                obrigatory
                value={destinyState}
                onChange={handleDestinyStateChange}
                message={errorDestinyState}
                disable={method == 'detalhes'}
              >
                <option value="0">SELECIONAR</option>
                {states.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </FormInputSelect>
            </Row>
            <Row>
              <FormInputSelect
                colSm={12}
                id="cidade-destino"
                label="Cidade de destino"
                obrigatory
                value={destinyCity}
                onChange={handleDestinyCityChange}
                disable={destinyState == '0' || method == 'detalhes'}
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
        </Col>
        <Col sm="8">
          <FieldsetCard legend="Pagamento motorista" obrigatoryFields>
            <Row>
              <FormInputSelect
                colSm={7}
                id="motorista"
                label="Motorista"
                obrigatory
                value={driver}
                onChange={handleDriverChange}
                message={errorDriver}
                disable={method == 'detalhes'}
              >
                <option value="0">SELECIONE</option>
                {drivers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.person.individual?.name}
                  </option>
                ))}
              </FormInputSelect>
              <FormInputGroupText
                colSm={5}
                id="valor-motorista"
                label="Valor"
                groupText={'R$'}
                obrigatory
                mask="#.##0,00"
                maskReversal={true}
                maskPlaceholder="0,00"
                value={driverAmount}
                onChange={handleDriverAmountChange}
                message={errorDriverAmount}
                readonly={method == 'detalhes'}
              />
            </Row>
            <Row>
              <FormInputGroupText
                colSm={5}
                id="valor-adiantamento-motorista"
                label="Valor adiantamento"
                groupText={'R$'}
                obrigatory
                mask="#.##0,00"
                maskReversal={true}
                maskPlaceholder="0,00"
                value={driverAmountEntry}
                onChange={handleDriverAmountEntryChange}
                readonly={method == 'detalhes'}
              />
              <FormInputSelect
                colSm={7}
                id="forma-pagamento-motorista"
                label="Forma de Pagamento"
                obrigatory
                value={driverForm}
                onChange={handleDriverFormChange}
                disable={method == 'detalhes'}
              >
                <option value="0">SELECIONE</option>
                {paymentForms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.description}
                  </option>
                ))}
              </FormInputSelect>
            </Row>
          </FieldsetCard>
        </Col>
      </Row>
      <FieldsetCard legend="Valores do Pedido" obrigatoryFields>
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
            onChange={(e) => handleWeightChange(e)}
            message={errorWeight}
            readonly
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
            onChange={(e) => handlePriceChange(e)}
            message={errorPrice}
            readonly={method == 'detalhes'}
          />
          <FormInputSelect
            colSm={3}
            id="forma-pagamento"
            label="Forma de Pagamento"
            obrigatory
            value={form}
            onChange={handleFormChange}
            message={errorForm}
            disable={method == 'detalhes'}
          >
            <option value="0">SELECIONE</option>
            {paymentForms.map((item) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </FormInputSelect>
          <FormInputDate
            colSm={3}
            id="entrega"
            label="Data Aprox. de Entrega"
            obrigatory
            value={shipping}
            onChange={handleShippingChange}
            message={errorShipping}
            readonly={method == 'detalhes'}
          />
        </Row>
      </FieldsetCard>
      <FormButtonsSave
        backLink="/pedidos/frete"
        clear={method == 'abrir'}
        handle={handleButtons}
      />
    </>
  );
}
