
import React, { useState } from 'react';
import { FileText, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import InteractiveDataTable from '@/components/Common/InteractiveDataTable';
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

  const totalValue = contractsData.reduce((sum, contract) => {
    const value = parseFloat(contract.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + value;
  }, 0);

  const activeContracts = contractsData.filter(c => c.status === 'Ativo').length;
  const pendingContracts = contractsData.filter(c => c.status === 'Em Análise').length;
  const completedContracts = contractsData.filter(c => c.status === 'Finalizado').length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-100/40">
      {/* Statistics Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Contratos</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{contractsData.length}</p>
                <p className="text-xs text-blue-600 mt-1">Contratos cadastrados</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Contratos Ativos</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{activeContracts}</p>
                <p className="text-xs text-emerald-600 mt-1">Em execução</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Em Análise</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{pendingContracts}</p>
                <p className="text-xs text-amber-600 mt-1">Aguardando aprovação</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Valor Total</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-purple-600 mt-1">Valor dos contratos</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageTemplate
        title="Contratos"
        icon={FileText}
        searchPlaceholder="Pesquisar contratos..."
        addButtonText="NOVO CONTRATO"
        onAddClick={() => {}}
        customAddButton={
          <NewContractDialog onAdd={handleAddContract}>
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              NOVO CONTRATO
            </button>
          </NewContractDialog>
        }
      >
        <InteractiveDataTable
          columns={columns}
          data={contractsData}
          emptyMessage="Nenhum contrato encontrado"
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </PageTemplate>
    </div>
  );
};

export default Contracts;
