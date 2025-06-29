
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';
import NewContractDialog from '@/components/Dialogs/NewContractDialog';

interface Contract {
  id: string;
  cliente: string;
  projeto: string;
  dataAssinatura: string;
  status: string;
  valor: string;
}

const Contracts = () => {
  const [contractsData, setContractsData] = useState<Contract[]>([
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

  const handleAddContract = (newContract: Omit<Contract, 'id'>) => {
    const contractWithId = {
      ...newContract,
      id: `CT${String(contractsData.length + 1).padStart(3, '0')}`,
      dataAssinatura: newContract.dataAssinatura || new Date().toLocaleDateString('pt-BR')
    };
    setContractsData(prev => [contractWithId, ...prev]);
  };

  const handleEdit = (contract: Contract) => {
    console.log('Editar contrato:', contract);
  };

  const handleView = (contract: Contract) => {
    console.log('Visualizar contrato:', contract);
  };

  const handleDelete = (contract: Contract) => {
    if (window.confirm(`Tem certeza que deseja excluir o contrato "${contract.id}"?`)) {
      setContractsData(prev => prev.filter(c => c.id !== contract.id));
    }
  };

  return (
    <PageTemplate
      title="Contratos"
      icon={FileText}
      searchPlaceholder="Pesquisar contratos..."
      addButtonText="NOVO CONTRATO"
      onAddClick={() => {}}
      customAddButton={
        <NewContractDialog onAdd={handleAddContract}>
          <button className="bg-[#28A745] hover:bg-[#218838] text-white font-medium px-4 py-2 rounded-md">
            NOVO CONTRATO
          </button>
        </NewContractDialog>
      }
    >
      <DataTable
        columns={columns}
        data={contractsData}
        emptyMessage="Nenhum contrato encontrado"
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </PageTemplate>
  );
};

export default Contracts;
