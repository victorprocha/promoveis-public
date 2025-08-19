
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/Layout/ProtectedRoute";
import Layout from "@/components/Layout/Layout";
import Dashboard from "@/components/Modules/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Pages
import Clients from "./pages/Clients";
import Contracts from "./pages/Contracts";
import ClientDetailsWrapper from "./pages/ClientDetailsWrapper";
import ContractDetailsWrapper from "./pages/ContractDetailsWrapper";
import ProjectDetailsWrapper from "./pages/ProjectDetailsWrapper";
import NovoColaboradorWrapper from "./pages/NovoColaboradorWrapper";
import EstoqueWrapper from "./pages/EstoqueWrapper";
import CadastroProdutoWrapper from "./pages/CadastroProdutoWrapper";
import Orcamentos from "./pages/Orcamentos";
import CriarOrcamento from "./pages/CriarOrcamento";
import Sales from "./pages/Sales";
import Specifiers from "./pages/Specifiers";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectRegistration from "./pages/ProjectRegistration";
import ProjectsList from "./pages/ProjectsList";
import PortfolioTracking from "@/components/Modules/PortfolioTracking";
import PainelProjetos from "@/components/Modules/PainelProjetos";
import ColaboradoresWrapper from "./pages/ColaboradoresWrapper";
import NovoColaborador from "./pages/NovoColaborador";
import Estoque from "./pages/Estoque";
import CadastroProduto from "./pages/CadastroProduto";
import HistoricoLancamentos from "./pages/HistoricoLancamentos";
import HistoricoLancamentosWrapper from "./pages/HistoricoLancamentosWrapper";
import PedidosCompra from "./pages/PedidosCompra";
import PedidosCompraWrapper from "./pages/PedidosCompraWrapper";
import NovoPedidoCompra from "./pages/NovoPedidoCompra";
import NovoPedidoCompraWrapper from "./pages/NovoPedidoCompraWrapper";
import EditarPedido from "./pages/EditarPedido";
import EditarPedidoWrapper from "./pages/EditarPedidoWrapper";
import PedidoView from "./pages/PedidoView";
import PedidoViewWrapper from "./pages/PedidoViewWrapper";
import PedidosSaida from "./pages/PedidosSaida";
import PedidosSaidaWrapper from "./pages/PedidosSaidaWrapper";
import NovoPedidoSaida from "./pages/NovoPedidoSaida";
import NovoPedidoSaidaWrapper from "./pages/NovoPedidoSaidaWrapper";
import EditarPedidoSaida from "./pages/EditarPedidoSaida";
import EditarPedidoSaidaWrapper from "./pages/EditarPedidoSaidaWrapper";
import Compromissos from "./pages/Compromissos";
import AgendaEntrega from "./pages/AgendaEntrega";
import MinhaEmpresa from "./pages/MinhaEmpresa";
import EmitenteNFe from "./pages/EmitenteNFe";
import Usuarios from "./pages/Usuarios";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroUsuarioWrapper from "./pages/CadastroUsuarioWrapper";
import ContratoEditor from "./pages/ContratoEditor";
import ContratoEditorWrapper from "./pages/ContratoEditorWrapper";
import CadastroMatrizEventos from "./pages/CadastroMatrizEventos";
import FluxoPadraoDetalhes from "./pages/FluxoPadraoDetalhes";
import EnvironmentReview from "./pages/EnvironmentReview";
import Deliveries from "./pages/Deliveries";
import Assembly from "./pages/Assembly";
import DeliveriesAndAssembly from "./pages/DeliveriesAndAssembly";
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Comercial Routes */}
            <Route path="/clientes" element={<ProtectedRoute><Layout><Clients /></Layout></ProtectedRoute>} />
            <Route path="/clientes/:id" element={<ProtectedRoute><Layout><ClientDetailsWrapper /></Layout></ProtectedRoute>} />
            <Route path="/contratos" element={<ProtectedRoute><Layout><Contracts /></Layout></ProtectedRoute>} />
            <Route path="/contratos/:id" element={<ProtectedRoute><Layout><ContractDetailsWrapper /></Layout></ProtectedRoute>} />
            <Route path="/orcamentos" element={<ProtectedRoute><Layout><Orcamentos /></Layout></ProtectedRoute>} />
            <Route path="/orcamentos/criar" element={<ProtectedRoute><Layout><CriarOrcamento /></Layout></ProtectedRoute>} />
            <Route path="/vendas" element={<ProtectedRoute><Layout><Sales /></Layout></ProtectedRoute>} />
            <Route path="/especificadores" element={<ProtectedRoute><Layout><Specifiers /></Layout></ProtectedRoute>} />
            
            {/* Projetos Routes */}
            <Route path="/projetos" element={<ProtectedRoute><Layout><ProjectsList /></Layout></ProtectedRoute>} />
            <Route path="/projetos/novo" element={<ProtectedRoute><Layout><ProjectRegistration /></Layout></ProtectedRoute>} />
            <Route path="/projetos/:id" element={<ProtectedRoute><Layout><ProjectDetailsWrapper /></Layout></ProtectedRoute>} />
            <Route path="/carteira" element={<ProtectedRoute><Layout><PortfolioTracking /></Layout></ProtectedRoute>} />
            <Route path="/painel-projetos" element={<ProtectedRoute><Layout><PainelProjetos /></Layout></ProtectedRoute>} />
            
            {/* Sistema Routes */}
            <Route path="/colaboradores" element={<ProtectedRoute><Layout><ColaboradoresWrapper /></Layout></ProtectedRoute>} />
            <Route path="/colaboradores/novo" element={<ProtectedRoute><Layout><NovoColaboradorWrapper /></Layout></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><Layout><Usuarios /></Layout></ProtectedRoute>} />
            <Route path="/usuarios/cadastrar" element={<ProtectedRoute><Layout><CadastroUsuarioWrapper /></Layout></ProtectedRoute>} />
            <Route path="/usuarios/novo" element={<ProtectedRoute><Layout><CadastroUsuarioWrapper /></Layout></ProtectedRoute>} />
            <Route path="/minha-empresa" element={<ProtectedRoute><Layout><MinhaEmpresa /></Layout></ProtectedRoute>} />
            <Route path="/emitente-nfe" element={<ProtectedRoute><Layout><EmitenteNFe /></Layout></ProtectedRoute>} />
            
            {/* Compras Routes */}
            <Route path="/estoque" element={<ProtectedRoute><Layout><EstoqueWrapper /></Layout></ProtectedRoute>} />
            <Route path="/produtos/cadastrar" element={<ProtectedRoute><Layout><CadastroProdutoWrapper /></Layout></ProtectedRoute>} />
            <Route path="/produtos/:id/historico" element={<ProtectedRoute><Layout><HistoricoLancamentosWrapper /></Layout></ProtectedRoute>} />
            <Route path="/pedidos-compra" element={<ProtectedRoute><Layout><PedidosCompraWrapper /></Layout></ProtectedRoute>} />
            <Route path="/pedidos-compra/novo" element={<ProtectedRoute><Layout><NovoPedidoCompraWrapper /></Layout></ProtectedRoute>} />
            <Route path="/pedidos-compra/:id/editar" element={<ProtectedRoute><Layout><EditarPedidoWrapper /></Layout></ProtectedRoute>} />
            <Route path="/pedidos-compra/:id" element={<ProtectedRoute><Layout><PedidoViewWrapper /></Layout></ProtectedRoute>} />
            <Route path="/pedidos-saida" element={<ProtectedRoute><Layout><PedidosSaidaWrapper /></Layout></ProtectedRoute>} />
            <Route path="/pedidos-saida/novo" element={<ProtectedRoute><Layout><NovoPedidoSaidaWrapper /></Layout></ProtectedRoute>} />
            <Route path="/pedidos-saida/:id/editar" element={<ProtectedRoute><Layout><EditarPedidoSaidaWrapper /></Layout></ProtectedRoute>} />
            
            {/* Agendas Routes */}
            <Route path="/compromissos" element={<ProtectedRoute><Layout><Compromissos /></Layout></ProtectedRoute>} />
            <Route path="/agenda-entrega" element={<ProtectedRoute><Layout><AgendaEntrega /></Layout></ProtectedRoute>} />
            
            {/* Configurações Routes */}
            <Route path="/contrato-editor" element={<ProtectedRoute><Layout><ContratoEditorWrapper /></Layout></ProtectedRoute>} />
            <Route path="/matriz-eventos" element={<ProtectedRoute><Layout><CadastroMatrizEventos /></Layout></ProtectedRoute>} />
            <Route path="/fluxo-padrao" element={<ProtectedRoute><Layout><FluxoPadraoDetalhes /></Layout></ProtectedRoute>} />
            
            {/* Pós-Venda Routes */}
            <Route path="/revisao-ambientes" element={<ProtectedRoute><Layout><EnvironmentReview /></Layout></ProtectedRoute>} />
            <Route path="/entregas" element={<ProtectedRoute><Layout><Deliveries /></Layout></ProtectedRoute>} />
            <Route path="/montagem" element={<ProtectedRoute><Layout><Assembly /></Layout></ProtectedRoute>} />
            <Route path="/entregas-montagens" element={<ProtectedRoute><Layout><DeliveriesAndAssembly /></Layout></ProtectedRoute>} />
            <Route path="/assistencias" element={<ProtectedRoute><Layout><PlaceholderPage title="Assistência Técnica" /></Layout></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
