
import React from 'react';
import { ArrowLeft, FileText, User, MapPin, Calendar, DollarSign, Package, FileCheck, CreditCard, Users, Paperclip } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContractDetailsProps {
  contractId: string | null;
  onBack: () => void;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ contractId, onBack }) => {
  // Mock data - substituir por dados reais do contrato
  const contractData = {
    id: 'CT001',
    numero: '2601',
    cliente: 'MARIA ISABELLA PACHECO MENEZES VIEIRA',
    telefone: '(22) 99944-1701',
    email: 'pachecomenezes@hotmail.com',
    projeto: 'MARIA ISABELLA PACHECO MENEZES VIEIRA - 08/05/25',
    orcamento: 'Orçamento Automático 1',
    condicaoPagamento: 'PARCELADO COM ENTRADA',
    observacao: 'Não Informado',
    observacaoPedido: 'Não Informado',
    lojaUnidade: 'STORE MODULADOS LTDA',
    tipoVenda: 'Normal',
    liberacaoComercial: '08/05/2025',
    liberacaoFinanceira: '08/05/2025',
    descricaoContrato: 'Peças do Projeto',
    andamentoObra: 'Totalmente Pronta',
    statusImpressao: 'Impresso',
    dataAprovacao: '08/05/2025',
    assinaturaContrato: '08/05/2025',
    situacao: 'Liberado',
    enderecoEntrega: 'RUA Rua Saldanha Marinho - de 148 ao fim - lado par, nº 452/615, Centro, Campos Dos Goytacazes - RJ, 28010-272',
    enderecoCobranca: 'RUA ARTUR EMILIANO COSTA, nº 117, PARQUE LEOPOLDINA, Campos Dos Goytacazes - RJ, 28053-010',
    prazoEntregaSugerido: '82',
    prazoEntrega: '55',
    previsaoEntrega: '02/07/2025',
    observacoesMontagem: 'Não Informado',
    prioridadeMontagem: 'Não Informado',
    ambientes: [
      {
        ambiente: '1 CORPORATIVO',
        nome: 'ESCRITÓRIO',
        situacao: 'Em Contrato',
        valorLiquido: 'R$ 31.475,36',
        valorTotal: 'R$ 32.360,00'
      }
    ],
    parcelas: [
      {
        parcela: 'Entrada',
        portador: 'CAIXA LOJA',
        valorParcela: 'R$ 10.786,67',
        dataVencimento: '08/05/2025',
        formaPagamento: 'PIX R$ 10.786,67',
        titulo: 'DUP-26010'
      },
      {
        parcela: '1',
        portador: 'CAIXA LOJA',
        valorParcela: 'R$ 10.786,67',
        dataVencimento: '07/06/2025',
        formaPagamento: 'Boleto R$ 10.786,67',
        titulo: 'DUP-26011'
      },
      {
        parcela: '2',
        portador: 'CAIXA LOJA',
        valorParcela: 'R$ 10.786,66',
        dataVencimento: '07/07/2025',
        formaPagamento: 'Boleto R$ 10.786,66',
        titulo: 'DUP-26012'
      }
    ],
    valorLiquido: 'R$ 31.475,36',
    valorTotal: 'R$ 32.360,00'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-100/40">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-slate-100/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Detalhes do Contrato</h1>
              <p className="text-sm text-slate-500">Contrato {contractData.numero}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Informações Básicas */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="bg-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CONTRATO {contractData.numero}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cliente</p>
                    <p className="font-semibold text-slate-800">{contractData.cliente}</p>
                    <p className="text-sm text-slate-600">{contractData.telefone}</p>
                    <p className="text-sm text-slate-600">{contractData.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-600">Loja/Unidade</p>
                    <p className="font-semibold text-blue-600">{contractData.lojaUnidade}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-600">Liberação Comercial</p>
                    <p className="font-semibold text-emerald-600">{contractData.liberacaoComercial}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-600">Status da Impressão</p>
                    <p className="font-semibold text-purple-600">{contractData.statusImpressao}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Projeto</p>
                <p className="font-semibold text-slate-800">{contractData.projeto}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Orçamento</p>
                  <p className="text-slate-800">{contractData.orcamento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Condição de Pagamento</p>
                  <p className="text-slate-800">{contractData.condicaoPagamento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Situação</p>
                  <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm font-medium">
                    {contractData.situacao}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Entrega/Cobrança */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="bg-cyan-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dados Entrega/Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Endereço de Entrega</p>
                <p className="text-slate-800">{contractData.enderecoEntrega}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Endereço de Cobrança</p>
                <p className="text-slate-800">{contractData.enderecoCobranca}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">Prazo de Entrega Sugerido (dias)</p>
                <p className="text-2xl font-bold text-slate-800">{contractData.prazoEntregaSugerido}</p>
              </div>
              <div className="text-center bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">Prazo de Entrega (dias)</p>
                <p className="text-2xl font-bold text-slate-800">{contractData.prazoEntrega}</p>
              </div>
              <div className="text-center bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">Previsão de Entrega</p>
                <p className="text-lg font-bold text-slate-800">{contractData.previsaoEntrega}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ambientes */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="bg-lime-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Ambientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Ambiente</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Situação</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">Valor Líquido</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {contractData.ambientes.map((ambiente, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4 text-slate-800">{ambiente.ambiente}</td>
                      <td className="px-6 py-4 text-slate-800">{ambiente.nome}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {ambiente.situacao}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">{ambiente.valorLiquido}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">{ambiente.valorTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Parcelas/Formas de Pagamento */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="bg-blue-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Parcelas/Formas de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Parcela</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Portador</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">Valor Parcela</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Data de Vencimento</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Forma de Pagamento</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Título</th>
                  </tr>
                </thead>
                <tbody>
                  {contractData.parcelas.map((parcela, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4 text-slate-800">{parcela.parcela}</td>
                      <td className="px-6 py-4 text-slate-800">{parcela.portador}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">{parcela.valorParcela}</td>
                      <td className="px-6 py-4 text-slate-800">{parcela.dataVencimento}</td>
                      <td className="px-6 py-4 text-slate-800">{parcela.formaPagamento}</td>
                      <td className="px-6 py-4 text-slate-800">{parcela.titulo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Seções Vazias */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader className="bg-amber-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4" />
                Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader className="bg-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Agendas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📅</div>
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader className="bg-slate-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Paperclip className="h-4 w-4" />
                Anexos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📎</div>
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </CardContent>
          </Card>
        </div>

        {/* Notas Fiscais */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader className="bg-amber-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Notas Fiscais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">🧾</div>
            <p className="text-gray-500">Nenhum registro encontrado</p>
          </CardContent>
        </Card>

        {/* Totais */}
        <div className="flex justify-end">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-slate-200/50 space-y-2">
            <div className="flex justify-between items-center gap-8">
              <span className="font-medium text-slate-600">Valor Líquido:</span>
              <span className="text-xl font-bold text-slate-800">{contractData.valorLiquido}</span>
            </div>
            <div className="flex justify-between items-center gap-8 pt-2 border-t">
              <span className="font-medium text-slate-600">Valor Total:</span>
              <span className="text-2xl font-bold text-slate-800">{contractData.valorTotal}</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-center gap-3 pt-6">
          <Button variant="outline" className="bg-white/80">
            MAIS OPÇÕES
          </Button>
          <Button variant="outline" className="bg-white/80">
            RENEGOCIAR CONTRATO
          </Button>
          <Button variant="outline" className="bg-white/80">
            CANCELAR CONTRATO
          </Button>
          <Button variant="outline" className="bg-white/80">
            EDITAR
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            IMPRIMIR CONTRATO
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            REVISÃO DE AMBIENTES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
