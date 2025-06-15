
import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';

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

  return (
    <PageTemplate
      title="Agendamento de Montagens"
      icon={Wrench}
      searchPlaceholder="Pesquisar montagens..."
      addButtonText="NOVA MONTAGEM"
      onAddClick={() => console.log('Nova montagem')}
    >
      <DataTable
        columns={columns}
        data={assemblyData}
        emptyMessage="Nenhuma montagem encontrada"
      />
    </PageTemplate>
  );
};

export default Assembly;
