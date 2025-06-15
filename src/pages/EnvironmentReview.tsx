
import React, { useState, useMemo } from 'react';
import { Building, Clock, Clipboard, Lock } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import SummaryCards from '@/components/Common/SummaryCards';
import AdvancedDataTable from '@/components/Common/AdvancedDataTable';

const EnvironmentReview = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const [reviewData] = useState([
    { 
      id: '1',
      ambiente: '1 - CONSULTÓRIO', 
      contrato: 'CNT001', 
      revisor: 'Carlos Tech', 
      cliente: 'Dr. Silva Medicina',
      colResponsavel: 'Ana Santos',
      assinatura: '15/12/2024',
      libComercial: 'Liberado',
      libFinanceira: 'Pendente',
      valorProjeto: 25000,
      valorRevisado: 27500,
      diferencaPercent: 10.0,
      situacao: 'Incluída'
    },
    { 
      id: '2',
      ambiente: '2 - SALA DE ESPERA', 
      contrato: 'CNT001', 
      revisor: 'Pedro Check', 
      cliente: 'Dr. Silva Medicina',
      colResponsavel: 'Ana Santos',
      assinatura: '15/12/2024',
      libComercial: 'Liberado',
      libFinanceira: 'Liberado',
      valorProjeto: 15000,
      valorRevisado: 13500,
      diferencaPercent: -10.0,
      situacao: 'Aprovada'
    },
    { 
      id: '3',
      ambiente: '3 - RECEPÇÃO', 
      contrato: 'CNT002', 
      revisor: '', 
      cliente: 'Clínica Odonto',
      colResponsavel: 'João Lima',
      assinatura: '10/12/2024',
      libComercial: 'Pendente',
      libFinanceira: 'Pendente',
      valorProjeto: 18000,
      valorRevisado: 19800,
      diferencaPercent: 10.0,
      situacao: 'Em Análise'
    },
  ]);

  const summaryCards = [
    {
      icon: Clock,
      iconColor: 'bg-orange-500',
      title: 'Distribuição de Revisões',
      subtitle: '1 Revisão sem Revisor informado',
      onClick: () => console.log('Filtrar sem revisor')
    },
    {
      icon: Clipboard,
      iconColor: 'bg-blue-500',
      title: 'Revisões Pendentes',
      subtitle: '2 Distribuídas ou Iniciadas',
      onClick: () => console.log('Filtrar pendentes')
    },
    {
      icon: Lock,
      iconColor: 'bg-red-500',
      title: 'Liberação de Revisões',
      subtitle: '0 Revisões bloqueadas',
      onClick: () => console.log('Filtrar bloqueadas')
    }
  ];

  const columns = [
    { key: 'ambiente', header: 'Ambiente' },
    { key: 'contrato', header: 'Contrato' },
    { key: 'revisor', header: 'Revisor' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'colResponsavel', header: 'Col. Responsável' },
    { key: 'assinatura', header: 'Assinatura' },
    { key: 'libComercial', header: 'Lib. Comercial' },
    { key: 'libFinanceira', header: 'Lib. Financeira' },
    { key: 'valorProjeto', header: 'Valor do Projeto' },
    { key: 'valorRevisado', header: 'Valor Revisado' },
    { key: 'diferencaPercent', header: 'Diferença %' },
    { key: 'situacao', header: 'Situação' },
  ];

  const filteredData = useMemo(() => {
    if (!searchFilter) return reviewData;
    
    return reviewData.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchFilter.toLowerCase())
      )
    );
  }, [reviewData, searchFilter]);

  const financialSummary = useMemo(() => {
    const selectedData = reviewData.filter(item => selectedItems.includes(item.id));
    
    const valorProjeto = selectedData.reduce((sum, item) => sum + item.valorProjeto, 0);
    const valorRevisado = selectedData.reduce((sum, item) => sum + item.valorRevisado, 0);
    const diferenca = valorRevisado - valorProjeto;

    return { valorProjeto, valorRevisado, diferenca };
  }, [reviewData, selectedItems]);

  const bulkActions = [
    {
      label: 'INFORMAR REVISOR',
      action: (selectedIds: string[]) => {
        console.log('Informar revisor para:', selectedIds);
        // Aqui abriria um modal para atribuir revisor
      }
    },
    {
      label: 'NEGOCIAR',
      action: (selectedIds: string[]) => {
        console.log('Negociar:', selectedIds);
        // Aqui abriria um modal para negociação
      }
    },
    {
      label: 'LIBERAR',
      action: (selectedIds: string[]) => {
        console.log('Liberar:', selectedIds);
        // Aqui abriria um modal de confirmação
      }
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-[#2A3F54]">Revisões de Ambientes</h1>
      </div>
      
      {/* Page Content */}
      <div className="flex-1 p-6">
        <SummaryCards cards={summaryCards} />
        
        <AdvancedDataTable
          title="Revisões de Ambientes"
          icon={Building}
          columns={columns}
          data={filteredData}
          emptyMessage="Nenhuma revisão encontrada"
          onSearch={setSearchFilter}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          bulkActions={bulkActions}
          financialSummary={selectedItems.length > 0 ? financialSummary : undefined}
        />
      </div>
    </div>
  );
};

export default EnvironmentReview;
