
import React, { useState } from 'react';
import { Wrench, AlertCircle, Clock, CheckCircle, Users } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import InteractiveDataTable from '@/components/Common/InteractiveDataTable';

const TechnicalAssistance = () => {
  const [assistanceData] = useState([
    { ticket: 'ASS001', cliente: 'João Silva', produto: 'Cozinha Modulada', dataAbertura: '12/12/2024', status: 'Aberto', tecnico: 'Carlos Tech' },
    { ticket: 'ASS002', cliente: 'Empresa ABC', produto: 'Mesa Escritório', dataAbertura: '10/12/2024', status: 'Em Atendimento', tecnico: 'Ana Suporte' },
    { ticket: 'ASS003', cliente: 'Maria Santos', produto: 'Guarda-roupa', dataAbertura: '08/12/2024', status: 'Resolvido', tecnico: 'Pedro Fix' },
  ]);

  const columns = [
    { key: 'ticket', header: 'Ticket' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'produto', header: 'Produto' },
    { key: 'dataAbertura', header: 'Data Abertura' },
    { key: 'status', header: 'Status' },
    { key: 'tecnico', header: 'Técnico' },
  ];

  const handleEdit = (assistance: any) => {
    console.log('Editar assistência:', assistance);
  };

  const handleView = (assistance: any) => {
    console.log('Visualizar assistência:', assistance);
  };

  const handleDelete = (assistance: any) => {
    console.log('Excluir assistência:', assistance);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-pink-100/40">
      {/* Statistics Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Tickets</p>
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
                <p className="text-sm font-medium text-slate-600">Abertos</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-red-600 mt-1">Requer atenção</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-400 to-red-500 rounded-xl shadow-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Em Atendimento</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-amber-600 mt-1">Sendo processados</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Resolvidos</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-emerald-600 mt-1">Concluídos</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageTemplate
        title="Solicitações de Assistência"
        icon={Wrench}
        searchPlaceholder="Pesquisar assistências..."
        addButtonText="NOVA ASSISTÊNCIA"
        onAddClick={() => console.log('Nova assistência')}
      >
        <InteractiveDataTable
          columns={columns}
          data={assistanceData}
          emptyMessage="Nenhuma assistência encontrada"
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </PageTemplate>
    </div>
  );
};

export default TechnicalAssistance;
