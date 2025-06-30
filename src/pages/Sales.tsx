
import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import InteractiveDataTable from '@/components/Common/InteractiveDataTable';

const Sales = () => {
  const [salesData] = useState([
    { id: 'V001', cliente: 'João Silva', data: '15/12/2024', valor: 'R$ 25.000,00', status: 'Finalizada', vendedor: 'Maria Santos' },
    { id: 'V002', cliente: 'Empresa ABC Ltda', data: '14/12/2024', valor: 'R$ 45.000,00', status: 'Em Andamento', vendedor: 'Carlos Oliveira' },
    { id: 'V003', cliente: 'Ana Costa', data: '13/12/2024', valor: 'R$ 12.500,00', status: 'Cancelada', vendedor: 'Pedro Lima' },
  ]);

  const columns = [
    { key: 'id', header: 'ID Venda' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'data', header: 'Data' },
    { key: 'valor', header: 'Valor' },
    { key: 'status', header: 'Status' },
    { key: 'vendedor', header: 'Vendedor' },
  ];

  const handleEdit = (sale: any) => {
    console.log('Editar venda:', sale);
  };

  const handleView = (sale: any) => {
    console.log('Visualizar venda:', sale);
  };

  const handleDelete = (sale: any) => {
    console.log('Excluir venda:', sale);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
      {/* Statistics Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Vendas</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">R$ 82.500</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Vendas Finalizadas</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">3</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  3 clientes únicos
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Em Andamento</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-amber-600 mt-1">Aguardando conclusão</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ticket Médio</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">R$ 27.500</p>
                <p className="text-xs text-purple-600 mt-1">Por venda finalizada</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageTemplate
        title="Vendas"
        icon={ShoppingCart}
        searchPlaceholder="Pesquisar vendas..."
        addButtonText="NOVA VENDA"
        onAddClick={() => console.log('Nova venda')}
      >
        <InteractiveDataTable
          columns={columns}
          data={salesData}
          emptyMessage="Nenhuma venda encontrada"
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </PageTemplate>
    </div>
  );
};

export default Sales;
