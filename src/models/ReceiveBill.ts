import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { IEmployee, Employee } from './Employee';
import { IFreightOrder } from './FreightOrder';
import { IPaymentForm } from './PaymentForm';
import { IRepresentation } from './Representation';
import { ISaleOrder } from './SaleOrder';
import { toast } from 'react-toastify';

export interface IReceiveBill {
  id: number;
  date: string;
  bill: number;
  description: string;
  payer: string;
  amount: number;
  comission: boolean;
  situation: number;
  dueDate: string;
  receiveDate?: string;
  amountReceived: number;
  pendency?: IReceiveBill;
  paymentForm?: IPaymentForm;
  representation?: IRepresentation;
  saleOrder?: ISaleOrder;
  freightOrder?: IFreightOrder;
  author: IEmployee;
}

export class ReceiveBill implements IReceiveBill {
  private attributes: IReceiveBill;

  constructor(attributes?: IReceiveBill) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          bill: 0,
          description: '',
          payer: '',
          comission: false,
          amount: 0.0,
          dueDate: '',
          amountReceived: 0.0,
          situation: 0,
          author: new Employee(),
        };
  }

  get id(): number {
    return this.attributes.id;
  }
  set id(v: number) {
    this.attributes.id = v;
  }

  get date(): string {
    return this.attributes.date;
  }
  set date(v: string) {
    this.attributes.date = v;
  }

  get bill(): number {
    return this.attributes.bill;
  }
  set bill(v: number) {
    this.attributes.bill = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get payer(): string {
    return this.attributes.payer;
  }
  set payer(v: string) {
    this.attributes.payer = v;
  }

  get amount(): number {
    return this.attributes.amount;
  }
  set amount(v: number) {
    this.attributes.amount = v;
  }

  get comission(): boolean {
    return this.attributes.comission;
  }
  set comission(v: boolean) {
    this.attributes.comission = v;
  }

  get situation(): number {
    return this.attributes.situation;
  }
  set situation(v: number) {
    this.attributes.situation = v;
  }

  get dueDate(): string {
    return this.attributes.dueDate;
  }
  set dueDate(v: string) {
    this.attributes.dueDate = v;
  }

  get receiveDate(): string | undefined {
    return this.attributes.receiveDate;
  }
  set receiveDate(v: string | undefined) {
    this.attributes.receiveDate = v;
  }

  get amountReceived(): number {
    return this.attributes.amountReceived;
  }
  set amountReceived(v: number) {
    this.attributes.amountReceived = v;
  }

  get pendency(): IReceiveBill | undefined {
    return this.attributes.pendency;
  }
  set pendency(v: IReceiveBill | undefined) {
    this.attributes.pendency = v;
  }

  get paymentForm(): IPaymentForm | undefined {
    return this.attributes.paymentForm;
  }
  set paymentForm(v: IPaymentForm | undefined) {
    this.attributes.paymentForm = v;
  }

  get representation(): IRepresentation | undefined {
    return this.attributes.representation;
  }
  set representation(v: IRepresentation | undefined) {
    this.attributes.representation = v;
  }

  get saleOrder(): ISaleOrder | undefined {
    return this.attributes.saleOrder;
  }
  set saleOrder(v: ISaleOrder | undefined) {
    this.attributes.saleOrder = v;
  }

  get freightOrder(): IFreightOrder | undefined {
    return this.attributes.freightOrder;
  }
  set freightOrder(v: IFreightOrder | undefined) {
    this.attributes.freightOrder = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get toAttributes(): IReceiveBill {
    const attributes: IReceiveBill = { ...this.attributes };
    return attributes;
  }

  async update() {
    const payload = {
      bill: {
        amountReceived: this.amountReceived,
        receiveDate: this.amountReceived > 0 ? this.receiveDate : undefined,
        situation:
          this.amountReceived > 0 ? (this.amountReceived < this.amount ? 2 : 3) : 1,
        paymentForm: this.paymentForm,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        '/receive-bill/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success(
          payload.bill.situation == 1
            ? 'Conta a pagar estornada com sucesso!'
            : 'Conta a pagar recebida com sucesso!',
        );
        return true;
      } else {
        toast.error(`Erro: ${response.data}`);
        return false;
      }
    } catch (e) {
      if (isAxiosError(e)) toast.error('Erro de requisição: ' + e.response?.data);
      return false;
    }
  }

  async getOne(id: number) {
    if (id <= 0) return undefined;
    try {
      const response = await axios.get('/receive-bill/' + id);
      return response.data ? new ReceiveBill(response.data) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get('/receive-bill');
      const bills: ReceiveBill[] = [];
      for (const data of response.data) bills.push(new ReceiveBill(data));
      return bills;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
