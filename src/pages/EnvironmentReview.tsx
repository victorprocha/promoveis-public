
import React, { useState } from 'react';
import { Building } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';

const EnvironmentReview = () => {
  const [reviewData] = useState([
    { projeto: 'Cozinha Silva', dataSolicitacao: '12/12/2024', status: 'Em Andamento', responsavel: 'Carlos Tech', prioridade: 'Alta' },
    { projeto: 'Escritório ABC', dataSolicitacao: '10/12/2024', status: 'Concluída', responsavel: 'Ana Revisora', prioridade: 'Média' },
    { projeto: 'Quarto Santos', dataSolicitacao: '08/12/2024', status: 'Pendente', responsavel: 'Pedro Check', prioridade: 'Baixa' },
  ]);

  const columns = [
    { key: 'projeto', header: 'Projeto' },
    { key: 'dataSolicitacao', header: 'Data Solicitação' },
    { key: 'status', header: 'Status' },
    { key: 'responsavel', header: 'Responsável' },
    { key: 'prioridade', header: 'Prioridade' },
  ];

  return (
    <PageTemplate
      title="Revisão de Ambientes"
      icon={Building}
      searchPlaceholder="Pesquisar revisões..."
      addButtonText="NOVA REVISÃO"
      onAddClick={() => console.log('Nova revisão')}
    >
      <DataTable
        columns={columns}
        data={reviewData}
        emptyMessage="Nenhuma revisão encontrada"
      />
    </PageTemplate>
  );
};

export default EnvironmentReview;
