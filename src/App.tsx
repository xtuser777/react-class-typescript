import React from 'react';
import { Header } from './components/header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Provider } from 'react-redux';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Protected } from './components/Protected';

import Login from './pages/Login';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Protected component="Home" />} />
              <Route path="/inicio" element={<Protected component="Home" />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/parametrizacao"
                element={<Protected component="Parameterization" />}
              />
              <Route path="/usuario/dados" element={<Protected component="User" />} />
              <Route path="/funcionarios" element={<Protected component="Employees" />} />
              <Route
                path="/funcionario/:method/:id?"
                element={<Protected component={'Employee'} />}
              />
              <Route path="/clientes" element={<Protected component={'Clients'} />} />
              <Route
                path="/cliente/:method/:id?"
                element={<Protected component={'Client'} />}
              />
              <Route path="/motoristas" element={<Protected component={'Drivers'} />} />
              <Route
                path="/motorista/:method/:id?"
                element={<Protected component={'Driver'} />}
              />
              <Route
                path="/representacoes"
                element={<Protected component={'Representations'} />}
              />
              <Route
                path="/representacao/:method/:id?"
                element={<Protected component={'Representation'} />}
              />
              <Route
                path="/proprietarios"
                element={<Protected component={'Proprietaries'} />}
              />
              <Route
                path="/proprietario/:method/:id?"
                element={<Protected component={'Proprietary'} />}
              />
              <Route
                path="/tiposcaminhao"
                element={<Protected component={'TruckTypes'} />}
              />
              <Route
                path="/tipocaminhao/:method/:id?"
                element={<Protected component={'TruckType'} />}
              />
              <Route
                path="/categorias"
                element={<Protected component={'Categories'} />}
              />
              <Route
                path="/categoria/:method/:id?"
                element={<Protected component={'Category'} />}
              />
              <Route
                path="/formaspagamento"
                element={<Protected component={'PaymentForms'} />}
              />
              <Route
                path="/formapagamento/:method/:id?"
                element={<Protected component={'PaymentForm'} />}
              />
              <Route path="/caminhoes" element={<Protected component={'Trucks'} />} />
              <Route
                path="/caminhao/:method/:id?"
                element={<Protected component={'Truck'} />}
              />
              <Route path="/produtos" element={<Protected component={'Products'} />} />
              <Route
                path="/produto/:method/:id?"
                element={<Protected component={'Product'} />}
              />
              <Route
                path="/orcamentos/venda"
                element={<Protected component={'SalesBudgets'} />}
              />
              <Route
                path="/orcamento/venda/:method/:id?"
                element={<Protected component={'SalesBudget'} />}
              />
              <Route
                path="/orcamentos/frete"
                element={<Protected component={'FreightBudgets'} />}
              />
              <Route
                path="/orcamento/frete/:method/:id?"
                element={<Protected component={'FreightBudget'} />}
              />
              <Route
                path="/pedidos/venda"
                element={<Protected component={'SalesOrders'} />}
              />
              <Route
                path="/pedido/venda/:method/:id?"
                element={<Protected component={'SalesOrder'} />}
              />
              <Route
                path="/pedidos/frete"
                element={<Protected component={'FreightOrders'} />}
              />
              <Route
                path="/pedido/frete/:method/:id?"
                element={<Protected component={'FreightOrder'} />}
              />
              <Route
                path="/pedidos/frete/status"
                element={<Protected component={'FreightOrdersStatus'} />}
              />
              <Route
                path="/pedido/frete/status/:id"
                element={<Protected component={'FreightOrderStatus'} />}
              />
              <Route
                path="/pedidos/frete/autorizar"
                element={<Protected component={'FreightOrdersAuthorize'} />}
              />
              <Route
                path="/pedido/frete/autorizar/:id"
                element={<Protected component={'FreightOrderAuthorize'} />}
              />
              <Route
                path="/contas/pagar"
                element={<Protected component={'BillsPay'} />}
              />
              <Route
                path="/conta/pagar/:id"
                element={<Protected component={'BillPay'} />}
              />
              <Route
                path="/contas/receber"
                element={<Protected component={'ReceiveBills'} />}
              />
              <Route
                path="/conta/receber/:id"
                element={<Protected component={'ReceiveBill'} />}
              />
              <Route
                path="/lancar/despesas"
                element={<Protected component={'ReleaseBills'} />}
              />
              <Route
                path="/lancar/despesa"
                element={<Protected component={'ReleaseBill'} />}
              />
              <Route
                path="/relatorio/clientes"
                element={<Protected component={'ClientsReport'} />}
              />
              <Route
                path="/relatorio/pedidos/venda"
                element={<Protected component={'SalesOrdersReport'} />}
              />
              <Route
                path="/relatorio/pedidos/frete"
                element={<Protected component={'FreightOrdersReport'} />}
              />
              <Route
                path="/relatorio/orcamentos/venda"
                element={<Protected component={'SalesBudgetsReport'} />}
              />
              <Route
                path="/relatorio/orcamentos/frete"
                element={<Protected component={'FreightBudgetsReport'} />}
              />
              <Route
                path="/relatorio/contas/pagar"
                element={<Protected component={'BillsPayReport'} />}
              />
              <Route
                path="/relatorio/contas/receber"
                element={<Protected component={'ReceiveBillsReport'} />}
              />
              <Route
                path="/relatorio/produtos"
                element={<Protected component={'ProductsReport'} />}
              />
            </Routes>
          </div>
          <ToastContainer autoClose={3000} theme="colored" pauseOnHover />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
