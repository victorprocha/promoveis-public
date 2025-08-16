import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HistoricoLancamentosProps {
  productId?: string | null;
  onBack: () => void;
}

const HistoricoLancamentos: React.FC<HistoricoLancamentosProps> = ({ productId, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  // Mock data - in real app this would come from the database
  const lancamentos = [
    {
      id: 1,
      data: '2025-11-15 14:20:43',
      tipo: 'entrada',
      quantidade: 2,
      origem: 'Manual',
      observacao: 'Compra de material'
    },
    // Add more mock data as needed
  ];

  const getLancamentoStats = () => {
    return {
      lancamentos: 1,
      entradas: 2,
      saidas: 0,
      devolucoes: 0,
      saldoAtual: 2
    };
  };

  const stats = getLancamentoStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Histórico de lançamentos do Produto</h1>
        </div>
        
        <Button 
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Devolução CH
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Pesquise pelo nome do responsável ou referência"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Entradas">Entradas</SelectItem>
            <SelectItem value="Saídas">Saídas</SelectItem>
            <SelectItem value="Devoluções">Devoluções</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="Data de"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-40"
        />

        <Input
          type="date"
          placeholder="Data até"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-40"
        />

        <Button variant="default" className="bg-primary text-white">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Product Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Lançamentos do produto DURATEX MDF P350 PU90 10MM 2X 2754144
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="font-semibold">Entrada</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="font-semibold">Usuário1</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-semibold">2025-11-15 14:20:43</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serv</p>
              <p className="font-semibold">-</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantidade</p>
              <p className="font-semibold">2</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Origem</p>
              <p className="font-semibold">Manual</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mt-6 grid grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Lançamentos:</p>
              <Badge variant="default" className="bg-primary">
                {stats.lancamentos}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entradas:</p>
              <Badge variant="default" className="bg-success">
                {stats.entradas}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saídas:</p>
              <Badge variant="destructive">
                {stats.saidas}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Devoluções:</p>
              <Badge variant="outline">
                {stats.devolucoes}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo atual:</p>
              <Badge variant="default" className="bg-secondary">
                {stats.saldoAtual}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {lancamentos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum lançamento encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">Tipo</th>
                    <th className="text-left p-2">Quantidade</th>
                    <th className="text-left p-2">Origem</th>
                    <th className="text-left p-2">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {lancamentos.map((lancamento) => (
                    <tr key={lancamento.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{lancamento.data}</td>
                      <td className="p-2">
                        <Badge 
                          variant={lancamento.tipo === 'entrada' ? 'default' : 'destructive'}
                          className={lancamento.tipo === 'entrada' ? 'bg-success' : ''}
                        >
                          {lancamento.tipo}
                        </Badge>
                      </td>
                      <td className="p-2">{lancamento.quantidade}</td>
                      <td className="p-2">{lancamento.origem}</td>
                      <td className="p-2">{lancamento.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoLancamentos;