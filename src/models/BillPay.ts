import { AxiosRequestConfig, isAxiosError } from 'axios';
import axios from '../services/axios';
import { BillPayCategory, IBillPayCategory } from './BillPayCategory';
import { IDriver } from './Driver';
import { IEmployee, Employee } from './Employee';
import { IFreightOrder } from './FreightOrder';
import { IPaymentForm } from './PaymentForm';
import { ISaleOrder } from './SaleOrder';
import { toast } from 'react-toastify';

export interface IBillPay {
  id: number;
  date: string;
  bill: number;
  type: number;
  description: string;
  enterprise: string;
  installment: number;
  amount: number;
  comission: boolean;
  situation: number;
  dueDate: string;
  paymentDate?: string;
  amountPaid: number;
  pendency?: IBillPay;
  driver?: IDriver;
  salesman?: IEmployee;
  freightOrder?: IFreightOrder;
  saleOrder?: ISaleOrder;
  paymentForm?: IPaymentForm;
  category: IBillPayCategory;
  author: IEmployee;
}

export class BillPay implements IBillPay {
  private attributes: IBillPay;

  constructor(attributes?: IBillPay) {
    this.attributes = attributes
      ? attributes
      : {
          id: 0,
          date: '',
          bill: 0,
          description: '',
          type: 0,
          enterprise: '',
          installment: 0,
          amount: 0.0,
          comission: false,
          situation: 0,
          dueDate: '',
          paymentDate: undefined,
          amountPaid: 0.0,
          pendency: undefined,
          driver: undefined,
          salesman: undefined,
          freightOrder: undefined,
          saleOrder: undefined,
          paymentForm: undefined,
          category: new BillPayCategory().toAttributes,
          author: new Employee().toAttributes,
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

  get type(): number {
    return this.attributes.type;
  }
  set type(v: number) {
    this.attributes.type = v;
  }

  get description(): string {
    return this.attributes.description;
  }
  set description(v: string) {
    this.attributes.description = v;
  }

  get enterprise(): string {
    return this.attributes.enterprise;
  }
  set enterprise(v: string) {
    this.attributes.enterprise = v;
  }

  get installment(): number {
    return this.attributes.installment;
  }
  set installment(v: number) {
    this.attributes.installment = v;
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

  get paymentDate(): string | undefined {
    return this.attributes.paymentDate;
  }
  set paymentDate(v: string | undefined) {
    this.attributes.paymentDate = v;
  }

  get amountPaid(): number {
    return this.attributes.amountPaid;
  }
  set amountPaid(v: number) {
    this.attributes.amountPaid = v;
  }

  get pendency(): IBillPay | undefined {
    return this.attributes.pendency;
  }
  set pendency(v: IBillPay | undefined) {
    this.attributes.pendency = v;
  }

  get driver(): IDriver | undefined {
    return this.attributes.driver;
  }
  set driver(v: IDriver | undefined) {
    this.attributes.driver = v;
  }

  get salesman(): IEmployee | undefined {
    return this.attributes.salesman;
  }
  set salesman(v: IEmployee | undefined) {
    this.attributes.salesman = v;
  }

  get freightOrder(): IFreightOrder | undefined {
    return this.attributes.freightOrder;
  }
  set freightOrder(v: IFreightOrder | undefined) {
    this.attributes.freightOrder = v;
  }

  get saleOrder(): ISaleOrder | undefined {
    return this.attributes.saleOrder;
  }
  set saleOrder(v: ISaleOrder | undefined) {
    this.attributes.saleOrder = v;
  }

  get category(): IBillPayCategory {
    return this.attributes.category;
  }
  set category(v: IBillPayCategory) {
    this.attributes.category = v;
  }

  get paymentForm(): IPaymentForm | undefined {
    return this.attributes.paymentForm;
  }
  set paymentForm(v: IPaymentForm | undefined) {
    this.attributes.paymentForm = v;
  }

  get author(): IEmployee {
    return this.attributes.author;
  }
  set author(v: IEmployee) {
    this.attributes.author = v;
  }

  get toAttributes(): IBillPay {
    const attributes: IBillPay = { ...this.attributes };
    return attributes;
  }

  async save(installments: number, interval: number, frequency: number) {
    const payload = {
      bill: {
        bill: this.bill,
        date: this.date,
        type: this.type,
        description: this.description,
        enterprise: this.enterprise,
        installment: this.installment,
        amount: this.amount,
        amountPaid: this.amountPaid,
        comission: false,
        dueDate: this.dueDate,
        paymentDate:
          this.amountPaid > 0 ? new Date().toISOString().substring(0, 10) : undefined,
        situation: this.amountPaid > 0 ? (this.amountPaid < this.amount ? 2 : 3) : 1,
        freightOrder: this.freightOrder,
        category: this.category,
        paymentForm: this.paymentForm,
        installments,
        interval,
        frequency,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.post('/bill-pay', payload);
      if (response.data.length == 0) {
        toast.success('Conta a pagar lançada com sucesso!');
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

  async update() {
    const payload = {
      bill: {
        amountPaid: this.amountPaid,
        paymentDate: this.amountPaid > 0 ? this.paymentDate : undefined,
        situation: this.amountPaid > 0 ? (this.amountPaid < this.amount ? 2 : 3) : 1,
        paymentForm: this.paymentForm,
      },
    };

    try {
      const response: AxiosRequestConfig = await axios.put(
        '/bill-pay/' + this.id,
        payload,
      );
      if (response.data.length == 0) {
        toast.success(
          payload.bill.situation == 1
            ? 'Conta a pagar estornada com sucesso!'
            : 'Conta a pagar quitada com sucesso!',
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

  async delete() {
    try {
      const response: AxiosRequestConfig = await axios.delete('/bill-pay/' + this.id);
      if (response.data.length == 0) {
        toast.success('Conta a pagar excluída com sucesso!');
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
      const response = await axios.get('/bill-pay/' + id);
      return response.data ? new BillPay(response.data) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async get() {
    try {
      const response = await axios.get('/bill-pay');
      const bills: BillPay[] = [];
      for (const data of response.data) bills.push(new BillPay(data));
      return bills;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
