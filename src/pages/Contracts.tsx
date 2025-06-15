
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';

const Contracts = () => {
  const [contractsData] = useState([
    { id: 'CT001', cliente: 'João Silva', projeto: 'Cozinha Modulada', dataAssinatura: '10/12/2024', status: 'Ativo', valor: 'R$ 25.000,00' },
    { id: 'CT002', cliente: 'Empresa ABC Ltda', projeto: 'Escritório Completo', dataAssinatura: '08/12/2024', status: 'Em Análise', valor: 'R$ 85.000,00' },
    { id: 'CT003', cliente: 'Maria Santos', projeto: 'Quarto Planejado', dataAssinatura: '05/12/2024', status: 'Finalizado', valor: 'R$ 15.000,00' },
  ]);

  const columns = [
    { key: 'id', header: 'ID Contrato' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'projeto', header: 'Projeto' },
    { key: 'dataAssinatura', header: 'Data Assinatura' },
    { key: 'status', header: 'Status' },
    { key: 'valor', header: 'Valor' },
  ];

  return (
    <PageTemplate
      title="Contratos"
      icon={FileText}
      searchPlaceholder="Pesquisar contratos..."
      addButtonText="NOVO CONTRATO"
      onAddClick={() => console.log('Novo contrato')}
    >
      <DataTable
        columns={columns}
        data={contractsData}
        emptyMessage="Nenhum contrato encontrado"
      />
    </PageTemplate>
  );
};

export default Contracts;
