
import React, { useState } from 'react';
import { Truck, Package, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import InteractiveDataTable from '@/components/Common/InteractiveDataTable';

const Deliveries = () => {
  const [deliveriesData] = useState([
    { pedido: 'PED001', cliente: 'João Silva', dataPrevista: '20/12/2024', statusEntrega: 'Programada', endereco: 'Rua A, 123' },
    { pedido: 'PED002', cliente: 'Empresa ABC', dataPrevista: '18/12/2024', statusEntrega: 'Em Rota', endereco: 'Av. B, 456' },
    { pedido: 'PED003', cliente: 'Maria Santos', dataPrevista: '15/12/2024', statusEntrega: 'Entregue', endereco: 'Rua C, 789' },
  ]);

  const columns = [
    { key: 'pedido', header: 'Pedido' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'dataPrevista', header: 'Data Prevista' },
    { key: 'statusEntrega', header: 'Status Entrega' },
    { key: 'endereco', header: 'Endereço' },
  ];

  const handleEdit = (delivery: any) => {
    console.log('Editar entrega:', delivery);
  };

  const handleView = (delivery: any) => {
    console.log('Visualizar entrega:', delivery);
  };

  const handleDelete = (delivery: any) => {
    console.log('Excluir entrega:', delivery);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-100/40">
      {/* Statistics Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Entregas</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">3</p>
                <p className="text-xs text-blue-600 mt-1">Este mês</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Programadas</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-amber-600 mt-1">Aguardando saída</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Em Rota</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-orange-600 mt-1">A caminho do destino</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Entregues</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-emerald-600 mt-1">Concluídas com sucesso</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageTemplate
        title="Controle de Entregas"
        icon={Truck}
        searchPlaceholder="Pesquisar entregas..."
        addButtonText="NOVA ENTREGA"
        onAddClick={() => console.log('Nova entrega')}
      >
        <InteractiveDataTable
          columns={columns}
          data={deliveriesData}
          emptyMessage="Nenhuma entrega encontrada"
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </PageTemplate>
    </div>
  );
};

export default Deliveries;
