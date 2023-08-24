import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { Home } from '../../pages/Home';
import { Parameterization } from '../../pages/Parameterization';
import { Employees } from '../../pages/Employees';
import Employee from '../../pages/Employee';
import { Clients } from '../../pages/Clients';
import Client from '../../pages/Client';
import { Drivers } from '../../pages/Drivers';
import Driver from '../../pages/Driver';
import { Representations } from '../../pages/Representations';
import Representation from '../../pages/Representation';
import { Proprietaries } from '../../pages/Proprietaries';
import Proprietary from '../../pages/Proprietary';
import { TruckTypes } from '../../pages/TruckTypes';
import TruckType from '../../pages/TruckType';
import { Categories } from '../../pages/Categories';
import Category from '../../pages/Category';
import { PaymentForms } from '../../pages/PaymentForms';
import PaymentForm from '../../pages/PaymentForm';
import { Trucks } from '../../pages/Trucks';
import Truck from '../../pages/Truck';
import { Products } from '../../pages/Products';
import Product from '../../pages/Product';
import { SalesBudgets } from '../../pages/SalesBudgets';
import { FreightBudgets } from '../../pages/FreightBudgets';
import { FreightBudget } from '../../pages/FreightBudget';
import { SalesOrders } from '../../pages/SalesOrders';
import { SalesOrder } from '../../pages/SalesOrder';
import { FreightOrders } from '../../pages/FreightOrders';
import { FreightOrder } from '../../pages/FreightOrder';
import { FreightOrdersStatus } from '../../pages/FreightOrdersStatus';
import { FreightOrderStatus } from '../../pages/FreightOrderStatus';
import { FreightOrdersAuthorize } from '../../pages/FreightOrdersAuthorize';
import { FreightOrderAuthorize } from '../../pages/FreightOrderAuthorize';
import { BillsPay } from '../../pages/BillsPay';
import { BillPay } from '../../pages/BillPay';
import { ReceiveBills } from '../../pages/ReceiveBills';
import { ReceiveBill } from '../../pages/ReceiveBill';
import { ReleaseBills } from '../../pages/ReleaseBills';
import { ReleaseBill } from '../../pages/ReleaseBill';
import { ClientsReport } from '../../pages/ClientsReport';
import { SalesOrdersReport } from '../../pages/SalesOrdersReport';
import { FreightOrdersReport } from '../../pages/FreightOrdersReport';
import { SalesBudgetsReport } from '../../pages/SalesBudgetsReport';
import { FreightBudgetsReport } from '../../pages/FreightBudgetsReport';
import { BillsPayReport } from '../../pages/BillsPayReport';
import { ReceiveBillsReport } from '../../pages/ReceiveBillsReport';
import { ProductsReport } from '../../pages/ProductsReport';
import { SalesBudget } from '../../pages/SalesBudget';
import { User } from '../../pages/User';

export const Protected = (props: { component: string }) => {
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  if (!isloggedIn) {
    return (
      <Navigate to="/login" replace state={{ prevPath: document.location.pathname }} />
    );
  }

  switch (props.component) {
    case 'Home':
      return <Home />;
    case 'Parameterization':
      return <Parameterization />;
    case 'User':
      return <User authState={useSelector((state: RootState) => state.auth)} />;
    case 'Employees':
      return <Employees />;
    case 'Employee':
      return <Employee />;
    case 'Clients':
      return <Clients />;
    case 'Client':
      return <Client />;
    case 'Drivers':
      return <Drivers />;
    case 'Driver':
      return <Driver />;
    case 'Representations':
      return <Representations />;
    case 'Representation':
      return <Representation />;
    case 'Proprietaries':
      return <Proprietaries />;
    case 'Proprietary':
      return <Proprietary />;
    case 'TruckTypes':
      return <TruckTypes />;
    case 'TruckType':
      return <TruckType />;
    case 'Categories':
      return <Categories />;
    case 'Category':
      return <Category />;
    case 'PaymentForms':
      return <PaymentForms />;
    case 'PaymentForm':
      return <PaymentForm />;
    case 'Trucks':
      return <Trucks />;
    case 'Truck':
      return <Truck />;
    case 'Products':
      return <Products />;
    case 'Product':
      return <Product />;
    case 'SalesBudgets':
      return <SalesBudgets />;
    case 'SalesBudget':
      return <SalesBudget params={useParams()} />;
    case 'FreightBudgets':
      return <FreightBudgets />;
    case 'FreightBudget':
      return <FreightBudget />;
    case 'SalesOrders':
      return <SalesOrders />;
    case 'SalesOrder':
      return <SalesOrder />;
    case 'FreightOrders':
      return <FreightOrders />;
    case 'FreightOrder':
      return <FreightOrder />;
    case 'FreightOrdersStatus':
      return <FreightOrdersStatus />;
    case 'FreightOrderStatus':
      return <FreightOrderStatus />;
    case 'FreightOrdersAuthorize':
      return <FreightOrdersAuthorize />;
    case 'FreightOrderAuthorize':
      return <FreightOrderAuthorize />;
    case 'BillsPay':
      return <BillsPay />;
    case 'BillPay':
      return <BillPay />;
    case 'ReceiveBills':
      return <ReceiveBills />;
    case 'ReceiveBill':
      return <ReceiveBill />;
    case 'ReleaseBills':
      return <ReleaseBills />;
    case 'ReleaseBill':
      return <ReleaseBill />;
    case 'ClientsReport':
      return <ClientsReport />;
    case 'SalesOrdersReport':
      return <SalesOrdersReport />;
    case 'FreightOrdersReport':
      return <FreightOrdersReport />;
    case 'SalesBudgetsReport':
      return <SalesBudgetsReport />;
    case 'FreightBudgetsReport':
      return <FreightBudgetsReport />;
    case 'BillsPayReport':
      return <BillsPayReport />;
    case 'ReceiveBillsReport':
      return <ReceiveBillsReport />;
    case 'ProductsReport':
      return <ProductsReport />;
  }
};
