import React, { MouseEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  UncontrolledDropdown,
} from 'reactstrap';
import { RootState } from '../store';
import * as actions from '../store/modules/auth/actions';
import history from '../services/history';

export function Header(): JSX.Element {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    history.push('/inicio');
  };

  return (
    <header>
      <Navbar className="navbar-scr" fixed="top" light={false} dark expand="sm">
        <NavbarBrand style={{ color: '#fff', fontWeight: 'bold' }} href="/">
          SCR
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {authState.isLoggedIn ? (
            <>
              <Nav className="me-auto" navbar>
                <NavItem>
                  <NavLink
                    style={{ color: '#fff' }}
                    className="font-navbar"
                    href="/inicio/"
                  >
                    Início
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle
                    style={{ color: '#fff' }}
                    className="font-navbar"
                    nav
                    caret
                  >
                    Gerenciar
                  </DropdownToggle>
                  <DropdownMenu end>
                    {authState.user.level == 1 ? (
                      <DropdownItem href="/funcionarios/">Funcionários</DropdownItem>
                    ) : (
                      ''
                    )}
                    <DropdownItem href="/clientes/">Clientes</DropdownItem>
                    <DropdownItem href="/motoristas/">Motoristas</DropdownItem>
                    <DropdownItem href="/proprietarios/">
                      Proprietários de Caminhões
                    </DropdownItem>
                    <DropdownItem href="/caminhoes/">Caminhões</DropdownItem>
                    <DropdownItem href="/representacoes/">Representações</DropdownItem>
                    <DropdownItem href="/produtos/">Produtos</DropdownItem>
                    <DropdownItem href="/tiposcaminhao/">Tipos de Caminhões</DropdownItem>
                    <DropdownItem href="/categorias/">
                      Categorias de Contas a Pagar
                    </DropdownItem>
                    <DropdownItem href="/formaspagamento/">
                      Formas de Pagamento
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle
                    style={{ color: '#fff' }}
                    className="font-navbar"
                    nav
                    caret
                  >
                    Orçamento
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem href="/orcamentos/venda/">Venda</DropdownItem>
                    <DropdownItem href="/orcamentos/frete/">Frete</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle
                    style={{ color: '#fff' }}
                    className="font-navbar"
                    nav
                    caret
                  >
                    Pedido
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem href="/pedidos/venda/">Venda</DropdownItem>
                    <DropdownItem href="/pedidos/frete/">Frete</DropdownItem>
                    <DropdownItem href="/pedidos/frete/status/">
                      Alterar Status
                    </DropdownItem>
                    {authState.user.level == 1 ? (
                      <DropdownItem href="/pedidos/frete/autorizar/">
                        Autorizar Carregamento
                      </DropdownItem>
                    ) : (
                      ''
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
                {authState.user.level == 1 || authState.user.level == 2 ? (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle
                      style={{ color: '#fff' }}
                      className="font-navbar"
                      nav
                      caret
                    >
                      Controlar
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem href="/contas/pagar/">Contas a Pagar</DropdownItem>
                      <DropdownItem href="/contas/receber/">
                        Contas a Receber
                      </DropdownItem>
                      <DropdownItem href="/lancar/despesas/">
                        Lançar Despesas
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                ) : (
                  ''
                )}
                {authState.user.level == 1 ? (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle
                      style={{ color: '#fff' }}
                      className="font-navbar"
                      nav
                      caret
                    >
                      Relatório
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem href="/relatorio/clientes/">
                        Relatório de Clientes
                      </DropdownItem>
                      <DropdownItem href="/relatorio/pedidos/venda/">
                        Relatório de Pedidos de Venda
                      </DropdownItem>
                      <DropdownItem href="/relatorio/pedidos/frete/">
                        Relatório de Pedidos de Frete
                      </DropdownItem>
                      <DropdownItem href="/relatorio/orcamentos/venda/">
                        Relatório de Orçamentos de Venda
                      </DropdownItem>
                      <DropdownItem href="/relatorio/orcamentos/frete/">
                        Relatório de Orçamentos de Frete
                      </DropdownItem>
                      <DropdownItem href="/relatorio/contas/pagar/">
                        Relatório de Contas a Pagar
                      </DropdownItem>
                      <DropdownItem href="/relatorio/contas/receber/">
                        relatório de Contas a Receber
                      </DropdownItem>
                      <DropdownItem href="/relatorio/produtos/">
                        Relatório de Produtos
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                ) : (
                  ''
                )}
              </Nav>
              <Nav className="navbar-right" navbar>
                <NavItem>
                  <NavLink
                    style={{ color: '#fff' }}
                    className="font-navbar"
                    href="/help/ManualdoUsuárioSCR.html"
                  >
                    Ajuda
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle
                    style={{ color: '#fff', fontWeight: 'bold' }}
                    className="font-navbar"
                    nav
                    caret
                  >
                    {authState.isLoggedIn ? authState.user.name : 'USER'}
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem header>Configurações</DropdownItem>
                    {authState.user.level == 1 ? (
                      <DropdownItem href="/parametrizacao/">Parametrização</DropdownItem>
                    ) : (
                      ''
                    )}
                    <DropdownItem href="/usuario/dados/">Meus Dados</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={handleLogout} href="/logout/">
                      Sair
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </>
          ) : (
            <>
              <Nav className="me-auto" navbar></Nav>
              <Nav className="navbar-right" navbar>
                <NavItem>
                  <NavLink
                    style={{ color: '#fff' }}
                    className="font-navbar"
                    href="/help/ManualdoUsuárioSCR.html"
                  >
                    Ajuda
                  </NavLink>
                </NavItem>
              </Nav>
            </>
          )}
        </Collapse>
      </Navbar>
    </header>
  );
}
