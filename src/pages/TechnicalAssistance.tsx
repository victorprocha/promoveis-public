
import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';

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

  return (
    <PageTemplate
      title="Solicitações de Assistência"
      icon={Wrench}
      searchPlaceholder="Pesquisar assistências..."
      addButtonText="NOVA ASSISTÊNCIA"
      onAddClick={() => console.log('Nova assistência')}
    >
      <DataTable
        columns={columns}
        data={assistanceData}
        emptyMessage="Nenhuma assistência encontrada"
      />
    </PageTemplate>
  );
};

export default TechnicalAssistance;
