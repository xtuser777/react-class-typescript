import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardTitle } from '../../components/card-title';
import { FieldsetCard } from '../../components/fieldset-card';
import { FormButtonsSave } from '../../components/form-buttons-save';
import { Badge, Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import { FormInputText } from '../../components/form-input-text';
import { FormInputSelect } from '../../components/form-input-select';
import { FormInputGroupText } from '../../components/form-input-group-text';
import { FormInputNumber } from '../../components/form-input-number';
import { FormButton } from '../../components/form-button';
import { FormInputGroupNumber } from '../../components/form-input-group-number';
import { SaleOrder as SaleOrderModel } from '../../models/SaleOrder';
import { ICity } from '../../models/City';
import { Client, IClient } from '../../models/Client';
import { Employee, IEmployee } from '../../models/Employee';
import { IProduct, Product } from '../../models/Product';
import { IRepresentation, Representation } from '../../models/Representation';
import { IState } from '../../models/State';
import { ISaleBudget, SaleBudget } from '../../models/SaleBudget';
import axios from '../../services/axios';
import { toast } from 'react-toastify';
import history from '../../services/history';
import { formatarPeso, formatarValor } from '../../utils/format';
import { useParams } from 'react-router-dom';
import { ISaleItem } from '../../models/SaleItem';
import { ReceiveBill } from '../../models/ReceiveBill';
import { EnterprisePerson, IEnterprisePerson } from '../../models/EnterprisePerson';
import { BillPay } from '../../models/BillPay';
import { IPaymentForm, PaymentForm } from '../../models/PaymentForm';
import { FaTrash } from 'react-icons/fa';
import { IndividualPerson } from '../../models/IndividualPerson';

export interface Comission {
  representacao: {
    id: number;
    nomeFantasia: string;
  };
  valor: number;
  porcentagem: number;
}

export function SalesOrder(): JSX.Element {
  const [order, setOrder] = useState(new SaleOrderModel());

  const [comissions, setComissions] = useState(new Array<Comission>());

  const [budgets, setBudgets] = useState(new Array<ISaleBudget>());
  const [clients, setClients] = useState(new Array<IClient>());
  const [states, setStates] = useState(new Array<IState>());
  const [cities, setCities] = useState(new Array<ICity>());
  const [salesmans, setSalesmans] = useState(new Array<IEmployee>());

  const [representations, setRepresentations] = useState(new Array<IRepresentation>());
  const [representationsDb, setRepresentationsDb] = useState(
    new Array<IRepresentation>(),
  );
  const [products, setProducts] = useState(new Array<IProduct>());
  const [productsDb, setProductsDb] = useState(new Array<IProduct>());

  const [paymentForms, setPaymentForms] = useState(new Array<IPaymentForm>());

  const [budget, setBudget] = useState('0');
  const [description, setDescription] = useState('');
  const [errorDescription, setErrorDescription] = useState<string | undefined>(undefined);
  const [client, setClient] = useState('0');
  const [errorClient, setErrorClient] = useState<string | undefined>(undefined);
  const [destinyState, setDestinyState] = useState('0');
  const [errorDestinyState, setErrorDestinyState] = useState<string | undefined>(
    undefined,
  );
  const [destinyCity, setDestinyCity] = useState('0');
  const [errorDestinyCity, setErrorDestinyCity] = useState<string | undefined>(undefined);

  const [salesman, setSalesman] = useState('0');
  const [comission, setComission] = useState(0);

  const [weight, setWeight] = useState('');
  const [errorWeight, setErrorWeight] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState('');
  const [errorPrice, setErrorPrice] = useState<string | undefined>(undefined);
  const [form, setForm] = useState('0');
  const [errorForm, setErrorForm] = useState<string | undefined>(undefined);

  const routeParams = useParams();
  const method = routeParams.method as string;
  let id = 0;
  if (routeParams.id) id = Number.parseInt(routeParams.id);

  useEffect(() => {
    const getStates = async () => {
      const response = await axios.get('/state');
      setStates(response.data);
      return response.data;
    };

    const getSalesmans = async () => {
      const response = await new Employee().get();
      const salesman = response.filter((item) => item.type == 2);
      setSalesmans(salesman);
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
        setItemPrice(formatarValor(product.price));
        setItemQuantity(1);
        setTotalItemPrice(formatarValor(product.price * itemQuantity));
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

    const getComissions = async (items: ISaleItem[]) => {
      const response = await new ReceiveBill().get();
      const representationsComission = response.filter(
        (item) => item.saleOrder?.id == id && item.comission && item.representation,
      );

      const comissions: Comission[] = [];
      for (const bill of representationsComission) {
        let value = 0;
        for (const item of items) {
          if (item.product.representation.id == bill.representation?.id)
            value += item.price;
        }
        value = Number(value.toString());
        comissions.push({
          representacao: {
            id: bill.representation?.id as number,
            nomeFantasia: (
              (bill.representation as IRepresentation).person
                .enterprise as IEnterprisePerson
            ).fantasyName,
          },
          porcentagem: Number(((bill.amount * 100) / value).toFixed()),
          valor: value,
        });
      }
      setComissions(comissions);
    };

    const getPaymentForms = async () => {
      const response = (await new PaymentForm().get()).filter((item) => item.link == 2);
      setPaymentForms(response);
    };

    const getBudgets = async () => {
      const response = await new SaleBudget().get();
      setBudgets(response);
    };

    const getData = async (states: IState[]) => {
      const order = await new SaleOrderModel().getOne(id);
      if (order) {
        setOrder(order);

        setBudget(order.budget ? order.budget.id.toString() : '0');
        setDescription(order.description);
        setClient(order.client.id.toString());
        setDestinyState(order.destiny.state.id.toString());
        setCities(states[order.destiny.state.id - 1].cities);
        setDestinyCity(order.destiny.id.toString());
        setSalesman(order.salesman ? order.salesman.id.toString() : '0');
        if (order.salesman != undefined) {
          const comission = (await new BillPay().get()).find(
            (item) => item.saleOrder?.id == id,
          ) as BillPay;
          setComission(Number(((comission.amount * 100) / order.value).toFixed()));
        }

        await getComissions(order.items);

        setWeight(formatarPeso(order.weight));
        setPrice(formatarValor(order.value));
        setForm(order.paymentForm.id.toString());

        setItems(order.items);
      }
    };

    const load = async () => {
      await getClients();
      await getSalesmans();
      await getRepresentations(await getProducts());
      await getPaymentForms();
      await getBudgets();
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
        setErrorPrice('O preço do produto precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorPrice('O preço do produto informado é inválido.');
        return false;
      } else {
        setErrorPrice(undefined);
        order.value = Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        return true;
      }
    },
    form: (value: string) => {
      if (value == '0') {
        setErrorForm('A forma de pagamento precisa ser selecionada.');
        return false;
      } else {
        setErrorForm(undefined);
        order.paymentForm = (
          paymentForms.find((item) => item.id == Number(value)) as PaymentForm
        ).toAttributes;
        return true;
      }
    },
    items: () => {
      if (items.length == 0) {
        toast.info('Não há itens adicionados ao orçamento.');
        return false;
      } else {
        order.items = items;
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
            setItemPrice(
              formatarValor(
                product.representation.person.contact.address.city.state.id ==
                  Number(destinyState)
                  ? product.price
                  : product.priceOut,
              ),
            );
            setItemQuantity(1);
            setTotalItemPrice(
              formatarValor(
                product.representation.person.contact.address.city.state.id ==
                  Number(destinyState)
                  ? product.price * itemQuantity
                  : product.priceOut * itemQuantity,
              ),
            );
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
          setErrorItem(undefined);

          setItemPrice(
            formatarValor(
              product.representation.person.contact.address.city.state.id ==
                Number(destinyState)
                ? product.price
                : product.priceOut,
            ),
          );
          setItemQuantity(1);
          setTotalItemPrice(
            formatarValor(
              product.representation.person.contact.address.city.state.id ==
                Number(destinyState)
                ? product.price * itemQuantity
                : product.priceOut * itemQuantity,
            ),
          );
          return true;
        }
      }
    },
    itemPrice: (value: string) => {
      if (value.length == 0) {
        setErrorItemPrice('O preço do item precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorItemPrice('O preço do item informado é inválido.');
        return false;
      } else {
        setErrorItemPrice(undefined);
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
        const price = Number.parseFloat(
          itemPrice.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
        setTotalItemPrice(formatarValor(price * val));
        return true;
      }
    },
    totalItemPrice: (value: string) => {
      if (value.length == 0) {
        setErrorTotalItemPrice('O preço total do item precisa ser preenchido.');
        return false;
      } else if (
        Number.parseFloat(
          value.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ) <= 0
      ) {
        setErrorTotalItemPrice('O preço total do item informado é inválido.');
        return false;
      } else {
        setErrorTotalItemPrice(undefined);
        return true;
      }
    },
  };

  //const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};
  const fillFieldsSale = async (saleId: number) => {
    const sale = (await new SaleBudget().getOne(saleId)) as SaleBudget;
    setClient(sale.client ? sale.client.id.toString() : '0');
    setDestinyState(sale.destiny.state.id.toString());
    setCities(states[sale.destiny.state.id - 1].cities);
    setDestinyCity(sale.destiny.id.toString());
    setSalesman(sale.salesman ? sale.salesman.id.toString() : '0');
    order.salesman = sale.salesman;

    const newItems: ISaleItem[] = [...sale.items];
    setItems(newItems);
    const newComissions: Comission[] = [...comissions];
    for (const item of newItems) {
      item.id = 0;
      item.budget = undefined;
      const representationComission = comissions.find(
        (i) => i.representacao.id == item.product.representation.id,
      );
      if (representationComission != undefined) {
        representationComission.valor += item.price;
      } else {
        newComissions.push({
          representacao: {
            id: item.product.representation.id,
            nomeFantasia: (
              item.product.representation.person.enterprise as EnterprisePerson
            ).fantasyName,
          },
          valor: item.price,
          porcentagem: 5,
        });
      }
    }
    setComissions(newComissions);
    order.weight = sale.toAttributes.weight;
    setWeight(formatarValor(sale.toAttributes.weight));
    order.value = sale.toAttributes.value;
    setPrice(formatarValor(sale.toAttributes.value));
    order.budget = sale.toAttributes;
  };

  const handleBudgetChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value);
    if (e.target.value != '0') {
      await fillFieldsSale(Number(e.target.value));
    } else {
      setClient('0');
      setDestinyState('0');
      setDestinyCity('0');
      setItems([]);
      setComissions([]);
      setWeight('');
      setPrice('');
      order.budget = undefined;
    }
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    validate.description(e.target.value);
  };
  const handleClientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClient(e.target.value);
    validate.client(e.target.value);
  };
  const handleDestinyStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestinyState(e.target.value);
    validate.destinyState(e.target.value);
  };
  const handleDestinyCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestinyCity(e.target.value);
    validate.destinyCity(e.target.value);
  };

  const handleClearItemsClick = () => {
    setItems([]);
    setWeight('');
    setPrice('');
  };

  const [addItems, setAddItems] = useState(false);

  const handleSalesmanChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalesman(e.target.value);
    if (e.target.value != '0')
      order.salesman = (
        salesmans.find((item) => item.id == Number(e.target.value)) as Employee
      ).toAttributes;
    else order.salesman = undefined;
  };
  const handleComissionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComission(Number.parseInt(e.target.value));
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

  const validateFields = () => {
    return (
      validate.description(description) &&
      validate.client(client) &&
      validate.destinyState(destinyState) &&
      validate.destinyCity(destinyCity) &&
      validate.items() &&
      validate.weight(weight) &&
      validate.price(price) &&
      validate.form(form)
    );
  };

  const clearFields = () => {
    setBudget('0');
    setDescription('');
    setClient('0');
    setDestinyState('0');
    setDestinyCity('0');
    setItems([]);
    setComissions([]);
    setSalesman('0');
    setComission(0);
    clearItemFields();
    setWeight('');
    setPrice('');
    setForm('0');
  };

  const persistData = async () => {
    if (validateFields()) {
      if (method == 'abrir') {
        if (await order.save(comissions, comission)) clearFields();
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
  const [items, setItems] = useState(new Array<ISaleItem>());
  const [itemRepresentation, setItemRepresentation] = useState('0');
  const [errorItemRepresentation, setErrorItemRepresentation] = useState<
    string | undefined
  >(undefined);
  const [itemRepresentationFilter, setItemRepresentationFilter] = useState('');
  const [item, setItem] = useState('0');
  const [errorItem, setErrorItem] = useState<string | undefined>(undefined);
  const [itemFilter, setItemFilter] = useState('');

  const [itemPrice, setItemPrice] = useState('');
  const [errorItemPrice, setErrorItemPrice] = useState<string | undefined>(undefined);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [errorItemQuantity, setErrorItemQuantity] = useState<string | undefined>(
    undefined,
  );
  const [totalItemPrice, setTotalItemPrice] = useState('');
  const [errorTotalItemPrice, setErrorTotalItemPrice] = useState<string | undefined>(
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
        setItemPrice(
          formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(destinyState)
              ? product.price
              : product.priceOut,
          ),
        );
        setItemQuantity(1);
        setTotalItemPrice(
          formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(destinyState)
              ? product.price * itemQuantity
              : product.priceOut * itemQuantity,
          ),
        );
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
      setItemPrice('');
      setItemQuantity(1);
      setTotalItemPrice('');
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
        setItemPrice(
          formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(destinyState)
              ? product.price
              : product.priceOut,
          ),
        );
        setItemQuantity(1);
        setTotalItemPrice(
          formatarValor(
            product.representation.person.contact.address.city.state.id ==
              Number(destinyState)
              ? product.price * itemQuantity
              : product.priceOut * itemQuantity,
          ),
        );
      }
    }
  };

  const handleItemPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemPrice(e.target.value);
    validate.itemPrice(e.target.value);
  };
  const handleItemQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemQuantity(Number.parseInt(e.target.value));
    validate.itemQuantity(e.target.value);
  };
  const handleTotalItemPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTotalItemPrice(e.target.value);
    validate.totalItemPrice(e.target.value);
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
      const product = newProducts.find((item) => item.id == newProducts[0].id) as Product;
      setItemPrice(formatarValor(product.price));
      setItemQuantity(1);
      setTotalItemPrice(formatarValor(product.price * itemQuantity));
    }
    //setItems([]);
  };

  const validateItemFields = () => {
    return (
      validate.itemRepresentation(itemRepresentation) &&
      validate.item(item) &&
      validate.itemPrice(itemPrice) &&
      validate.itemQuantity(itemQuantity.toString()) &&
      validate.totalItemPrice(totalItemPrice)
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
        price: Number.parseFloat(
          totalItemPrice.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        ),
      });
      setItems(newItems);
      let totalWeight = 0.0;
      newItems.forEach((item) => (totalWeight += item.weight));
      setWeight(formatarValor(totalWeight));

      let totalPrice = 0.0;
      newItems.forEach((item) => (totalPrice += item.price));
      setPrice(formatarValor(totalPrice));

      const representationComission = comissions.find(
        (item) => item.representacao.id == product.representation.id,
      );
      if (representationComission) {
        representationComission.valor += Number.parseFloat(
          totalItemPrice.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
        );
      } else {
        const newComissions: Comission[] = [...comissions];
        newComissions.push({
          representacao: {
            id: product.representation.id,
            nomeFantasia: (product.representation.person.enterprise as EnterprisePerson)
              .fantasyName,
          },
          valor: Number.parseFloat(
            totalItemPrice.replace(',', '#').replaceAll('.', ',').replace('#', '.'),
          ),
          porcentagem: 5,
        });
        setComissions(newComissions);
      }
    }
  };

  return (
    <>
      <CardTitle
        text={method == 'abrir' ? 'Abrir Pedido de Venda' : 'Detalhes do pedido de venda'}
      />
      <FieldsetCard legend="Dados do Pedido" obrigatoryFields>
        <Row>
          <FormInputSelect
            colSm={5}
            id="orcamento"
            label="Orçamento"
            obrigatory={false}
            value={budget}
            onChange={handleBudgetChange}
            disable={method == 'detalhes'}
          >
            <option value="0">SELECIONAR</option>
            {budgets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </FormInputSelect>
          <FormInputText
            colSm={7}
            id="desc"
            label="Descrição"
            obrigatory
            value={description}
            onChange={(e) => handleDescriptionChange(e)}
            readonly={method == 'detalhes'}
            message={errorDescription}
          />
        </Row>
        <Row>
          <FormInputSelect
            colSm={5}
            id="cliente"
            label="Cliente"
            obrigatory
            value={client}
            onChange={handleClientChange}
            disable={method == 'detalhes'}
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
          <FormInputSelect
            colSm={3}
            id="estado-destino"
            label="Estado de destino"
            obrigatory
            value={destinyState}
            onChange={handleDestinyStateChange}
            disable={method == 'detalhes'}
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
      <FieldsetCard legend="Itens do Pedido">
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
                      item.product.representation.person.contact.address.city.state.id ==
                        Number(destinyState)
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
                        if (budget == '0' && method == 'abrir') {
                          const newItems: ISaleItem[] = [];
                          items.forEach((i) => {
                            if (i.product.id != item.product.id) newItems.push(i);
                          });
                          setItems(newItems);
                          let totalWeight = 0.0;
                          newItems.forEach((item) => (totalWeight += item.weight));
                          setWeight(formatarValor(totalWeight));

                          let totalPrice = 0.0;
                          newItems.forEach((item) => (totalPrice += item.price));
                          setPrice(formatarValor(totalPrice));

                          const representationComission = comissions.find(
                            (i) => i.representacao.id == item.product.representation.id,
                          );
                          if (representationComission) {
                            representationComission.valor -= item.price;
                            if (representationComission.valor <= 0) {
                              const newComissions: Comission[] = [];
                              comissions.forEach((c) => {
                                if (c.representacao.id != item.product.representation.id)
                                  newComissions.push(c);
                              });
                              setComissions(newComissions);
                            }
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
              disabled={budget != '0' || method == 'detalhes'}
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
              disabled={budget != '0' || method == 'detalhes'}
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
                />
                <Input
                  type="select"
                  id="representacao-item"
                  bsSize="sm"
                  style={{ width: '100%' }}
                  value={itemRepresentation}
                  onChange={handleItemRepresentationChange}
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
              id="preco-produto"
              label="Valor Unitário"
              groupText={'R$'}
              obrigatory
              mask="#.##0,00"
              maskReversal={true}
              maskPlaceholder="0,00"
              value={itemPrice}
              onChange={handleItemPriceChange}
              message={errorItemPrice}
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
              id="preco-total-item"
              label="Valor Total"
              groupText={'R$'}
              obrigatory
              mask="#.##0,00"
              maskReversal={true}
              maskPlaceholder="0,00"
              value={totalItemPrice}
              onChange={handleTotalItemPriceChange}
              message={errorTotalItemPrice}
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
      <Row>
        <Col sm="4">
          <FieldsetCard legend="Vendedor externo">
            <Row>
              <FormInputSelect
                colSm={12}
                id="vendedor"
                label="Vendedor"
                obrigatory={false}
                value={salesman}
                onChange={handleSalesmanChange}
                disable={method == 'detalhes'}
              >
                <option value="0">SELECIONAR</option>
                {salesmans.map((item) => (
                  <option key={item.id} value={item.id}>
                    {(item.person.individual as IndividualPerson).name}
                  </option>
                ))}
              </FormInputSelect>
            </Row>
            <Row>
              <FormInputGroupNumber
                colSm={12}
                id="comissao-vendedor"
                label="Procentagem de comissão ao vendedor"
                groupText={'%'}
                obrigatory={false}
                value={comission}
                onChange={handleComissionChange}
                readonly={method == 'detalhes'}
              />
            </Row>
            <Row></Row>
          </FieldsetCard>
        </Col>
        <Col sm="8">
          <FieldsetCard legend="Comissões">
            <div className="table-container" style={{ height: '156px' }}>
              <Table id="tableComissions" striped hover size="sm">
                <thead>
                  <tr>
                    <th>REPRESENTAÇÃO</th>
                    <th>VALOR (R$)</th>
                    <th>PORCENTAGEM</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>

                <tbody id="tbodyComissoes">
                  {comissions.map((item) => (
                    <tr key={item.representacao.id}>
                      <td>{item.representacao.nomeFantasia}</td>
                      <td>{formatarValor(item.valor)}</td>
                      <td>{item.porcentagem}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </FieldsetCard>
        </Col>
      </Row>
      <FieldsetCard legend="Valores do Pedido" obrigatoryFields>
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
            onChange={(e) => handleWeightChange(e)}
            message={errorWeight}
            readonly
          />
          <FormInputGroupText
            colSm={4}
            id="preco"
            label="Preço Total"
            groupText={'R$'}
            obrigatory
            mask="#.##0,00"
            maskReversal={true}
            maskPlaceholder="0,00"
            value={price}
            onChange={(e) => handlePriceChange(e)}
            message={errorPrice}
            readonly
          />
          <FormInputSelect
            colSm={4}
            id="forma-pagamento"
            label="Forma de Pagamento"
            obrigatory
            value={form}
            onChange={handleFormChange}
            disable={method == 'detalhes'}
            message={errorForm}
          >
            <option value="0">SELECIONAR</option>
            {paymentForms.map((item) => (
              <option key={item.id} value={item.id}>
                {item.description}
              </option>
            ))}
          </FormInputSelect>
        </Row>
      </FieldsetCard>
      <FormButtonsSave
        backLink="/pedidos/venda"
        clear={method == 'abrir'}
        handle={handleButtons}
      />
    </>
  );
}
