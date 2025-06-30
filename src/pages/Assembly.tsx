
import React, { useState } from 'react';
import { Wrench, Calendar, User, CheckCircle, Clock } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import InteractiveDataTable from '@/components/Common/InteractiveDataTable';

const Assembly = () => {
  const [assemblyData] = useState([
    { pedido: 'MON001', cliente: 'João Silva', dataAgendada: '22/12/2024', horario: '09:00', tecnico: 'Carlos Montador', status: 'Agendada' },
    { pedido: 'MON002', cliente: 'Empresa ABC', dataAgendada: '21/12/2024', horario: '14:00', tecnico: 'Pedro Instalador', status: 'Em Andamento' },
    { pedido: 'MON003', cliente: 'Maria Santos', dataAgendada: '19/12/2024', horario: '10:00', tecnico: 'Ana Técnica', status: 'Concluída' },
  ]);

  const columns = [
    { key: 'pedido', header: 'Pedido' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'dataAgendada', header: 'Data Agendada' },
    { key: 'horario', header: 'Horário' },
    { key: 'tecnico', header: 'Técnico' },
    { key: 'status', header: 'Status' },
  ];

  const handleEdit = (assembly: any) => {
    console.log('Editar montagem:', assembly);
  };

  const handleView = (assembly: any) => {
    console.log('Visualizar montagem:', assembly);
  };

  const handleDelete = (assembly: any) => {
    console.log('Excluir montagem:', assembly);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-100/40">
      {/* Statistics Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Montagens</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">3</p>
                <p className="text-xs text-blue-600 mt-1">Este mês</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Agendadas</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-amber-600 mt-1">Próximas montagens</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Em Andamento</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-orange-600 mt-1">Sendo executadas</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Concluídas</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-emerald-600 mt-1">Finalizadas</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageTemplate
        title="Agendamento de Montagens"
        icon={Wrench}
        searchPlaceholder="Pesquisar montagens..."
        addButtonText="NOVA MONTAGEM"
        onAddClick={() => console.log('Nova montagem')}
      >
        <InteractiveDataTable
          columns={columns}
          data={assemblyData}
          emptyMessage="Nenhuma montagem encontrada"
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </PageTemplate>
    </div>
  );
};

export default Assembly;
