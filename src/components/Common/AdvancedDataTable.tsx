
import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Info, Briefcase, Clock as ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
}

interface TableData {
  id: string;
  [key: string]: any;
}

interface AdvancedDataTableProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  columns: Column[];
  data: TableData[];
  emptyMessage?: string;
  onSearch?: (value: string) => void;
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  bulkActions?: Array<{
    label: string;
    action: (selectedIds: string[]) => void;
  }>;
  financialSummary?: {
    valorProjeto: number;
    valorRevisado: number;
    diferenca: number;
  };
}

const AdvancedDataTable: React.FC<AdvancedDataTableProps> = ({
  title,
  icon: Icon,
  columns,
  data,
  emptyMessage = "Nenhum item encontrado",
  onSearch,
  selectedItems,
  onSelectionChange,
  bulkActions = [],
  financialSummary
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(data.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📄</div>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header da Tabela */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button variant="outline" size="icon" className="bg-gray-100">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" className="bg-gray-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.key === 'ambiente' ? (
                      <div className="flex items-center gap-2">
                        <span>{item[column.key]}</span>
                        <Info className="h-4 w-4 text-blue-500 cursor-pointer" />
                      </div>
                    ) : column.key === 'situacao' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item[column.key]}
                      </span>
                    ) : column.key === 'diferencaPercent' ? (
                      <span className={`font-medium ${parseFloat(item[column.key]) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item[column.key]}%
                      </span>
                    ) : column.key === 'valorProjeto' || column.key === 'valorRevisado' ? (
                      formatCurrency(item[column.key])
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Barra de Ações Contextuais */}
      {selectedItems.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedItems.length} Revisões selecionadas
              </span>
              
              <div className="flex gap-2">
                {bulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => action.action(selectedItems)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {financialSummary && (
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Valor do Projeto: </span>
                  <span className="font-medium">{formatCurrency(financialSummary.valorProjeto)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Valor Revisado: </span>
                  <span className="font-medium">{formatCurrency(financialSummary.valorRevisado)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Diferença: </span>
                  <span className={`font-medium ${financialSummary.diferenca >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(financialSummary.diferenca)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedDataTable;
