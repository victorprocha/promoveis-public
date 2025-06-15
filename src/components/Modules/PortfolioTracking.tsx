
import React, { useState } from 'react';
import { Search, FileX, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PortfolioTracking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [situation, setSituation] = useState('');
  const [creationPeriod, setCreationPeriod] = useState('');
  const [responsible, setResponsible] = useState('');
  const [store, setStore] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');

  const handleClearFilters = () => {
    setSearchTerm('');
    setSituation('');
    setCreationPeriod('');
    setResponsible('');
    setStore('');
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Comercial</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Acompanhamento de Carteira</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileX className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Acompanhamento de Carteira</h1>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search Field */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar Cliente, Projeto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Situation Filter */}
          <div>
            <Select value={situation} onValueChange={setSituation}>
              <SelectTrigger>
                <SelectValue placeholder="Situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Creation Period Filter */}
          <div>
            <Select value={creationPeriod} onValueChange={setCreationPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Criação do Projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Últimos 7 dias</SelectItem>
                <SelectItem value="last30">Últimos 30 dias</SelectItem>
                <SelectItem value="last90">Últimos 90 dias</SelectItem>
                <SelectItem value="last180">Últimos 180 dias</SelectItem>
                <SelectItem value="lastyear">Último ano</SelectItem>
                <SelectItem value="custom">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Responsible Filter */}
          <div>
            <Select value={responsible} onValueChange={setResponsible}>
              <SelectTrigger>
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="enzo">Enzo Vargas Santos</SelectItem>
                <SelectItem value="carlos">Carlos Lima</SelectItem>
                <SelectItem value="mariana">Mariana Rosa</SelectItem>
                <SelectItem value="ana">Ana Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second Row of Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Store/Unit Filter */}
          <div>
            <Select value={store} onValueChange={setStore}>
              <SelectTrigger>
                <SelectValue placeholder="Loja/Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Lojas</SelectItem>
                <SelectItem value="principal">Loja Principal</SelectItem>
                <SelectItem value="centro">Loja Centro</SelectItem>
                <SelectItem value="shopping">Loja Shopping</SelectItem>
                <SelectItem value="bairro">Loja Bairro Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:col-span-2 md:justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button className="bg-[#007BFF] hover:bg-[#0056B3] text-white">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg border">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FileX className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum registro encontrado
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Não foram encontrados registros que correspondam aos filtros aplicados. 
            Tente ajustar os critérios de busca ou limpar os filtros.
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
        </div>

        {/* Footer with Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Linhas por página:</span>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            0 de 0 registros
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards (when there are results) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Projetos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileX className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileX className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Concluídos</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FileX className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold text-purple-600">R$ 0,00</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileX className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTracking;
