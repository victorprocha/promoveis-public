import React, { useState } from 'react';
import { Truck, Package, Calendar, Search, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DeliveriesAndAssembly = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const deliveriesData = [
    {
      id: 1,
      promessaEntrega: '14/05/2020',
      prioridade: 'Não informado',
      cliente: 'Aline Andrade',
      contrato: '94901',
      ambiente: 'COZINHA DORMITÓRIO - CASAL',
      situacaoAmbiente: 'Em Contrato',
      tipoAgenda: 'Entrega',
      situacaoAgenda: 'Atrasado'
    },
    {
      id: 2,
      promessaEntrega: '10/05/2020',
      prioridade: 'Não informado',
      cliente: 'Amanda Soares',
      contrato: '94701',
      ambiente: 'BANHEIRO DORMITÓRIO - CASAL DORMITÓRIO - SOLTEIRO BANHEIRO',
      situacaoAmbiente: 'Projeto Concluído',
      tipoAgenda: 'Entrega',
      situacaoAgenda: 'Realizado'
    },
    {
      id: 3,
      promessaEntrega: '10/05/2020',
      prioridade: 'Não informado',
      cliente: 'Amanda Soares',
      contrato: '94701',
      ambiente: 'DORMITÓRIO - CASAL DORMITÓRIO - SOLTEIRO',
      situacaoAmbiente: 'Projeto Concluído',
      tipoAgenda: 'Montagem',
      situacaoAgenda: 'Realizado'
    },
    {
      id: 4,
      promessaEntrega: '06/05/2020',
      prioridade: 'Não informado',
      cliente: 'ANA VIANNA',
      contrato: '94402',
      ambiente: 'BANHEIRO',
      situacaoAmbiente: 'Em Pedido',
      tipoAgenda: 'Entrega',
      situacaoAgenda: 'Atrasado'
    },
    {
      id: 5,
      promessaEntrega: '19/05/2020',
      prioridade: 'Não informado',
      cliente: 'Aline Maciel',
      contrato: '91301',
      ambiente: 'sofá premium 2700x1200x900 ACQUA SC 300 - SOFA CAMA',
      situacaoAmbiente: 'Contrato Revisado',
      tipoAgenda: 'Entrega',
      situacaoAgenda: 'Atrasado'
    },
    {
      id: 6,
      promessaEntrega: '19/05/2020',
      prioridade: 'Não informado',
      cliente: 'Amanda Soares',
      contrato: '91201',
      ambiente: 'Sofá Vinicius',
      situacaoAmbiente: 'Em Pedido',
      tipoAgenda: 'Entrega',
      situacaoAgenda: 'Atrasado'
    },
    {
      id: 7,
      promessaEntrega: '19/05/2020',
      prioridade: 'Não informado',
      cliente: 'Amanda Soares',
      contrato: '91201',
      ambiente: 'sofá premium 2700x1200x900',
      situacaoAmbiente: 'Contrato Revisado',
      tipoAgenda: 'Entrega',
      situacaoAgenda: 'Atrasado',
      highlighted: true
    },
    {
      id: 8,
      promessaEntrega: '18/05/2020',
      prioridade: 'Não informado',
      cliente: 'Aline Andrade',
      contrato: '90601',
      ambiente: 'COZINHA DORMITÓRIO - SOLTEIRO',
      situacaoAmbiente: 'Montagem Concluída',
      tipoAgenda: 'Montagem',
      situacaoAgenda: 'Realizado'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'realizado':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{status}</Badge>;
      case 'atrasado':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSituacaoAmbienteBadge = (situacao: string) => {
    switch (situacao.toLowerCase()) {
      case 'projeto concluído':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{situacao}</Badge>;
      case 'montagem concluída':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{situacao}</Badge>;
      case 'em contrato':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{situacao}</Badge>;
      case 'em pedido':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{situacao}</Badge>;
      case 'contrato revisado':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{situacao}</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const filteredData = deliveriesData.filter(item =>
    item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contrato.includes(searchTerm) ||
    item.ambiente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
      <div className="p-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Truck className="h-6 w-6 text-white" />
                  <Package className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Entrega e Montagem</h1>
                <p className="text-slate-600 text-sm">Controle de entregas e agendamentos de montagem</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[100px]">
                    Promessa Entrega
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[120px]">
                    Prioridade
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[150px]">
                    Cliente
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[100px]">
                    Contrato
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[200px]">
                    Ambiente
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[150px]">
                    Situação Ambiente
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[120px]">
                    Tipo Agenda
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700 min-w-[120px]">
                    Situação Agenda
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                      item.highlighted ? 'bg-blue-50/80' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-slate-700">{item.promessaEntrega}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600">{item.prioridade}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-800 font-medium">{item.cliente}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-700">{item.contrato}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-700 max-w-[200px] truncate block" title={item.ambiente}>
                        {item.ambiente}
                      </span>
                    </td>
                    <td className="p-4">
                      {getSituacaoAmbienteBadge(item.situacaoAmbiente)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {item.tipoAgenda === 'Entrega' ? (
                          <Truck className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm text-slate-700">{item.tipoAgenda}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.situacaoAgenda)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">Nenhum registro encontrado</h3>
                <p className="text-slate-600">Tente ajustar os filtros de busca</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveriesAndAssembly;