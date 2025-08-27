
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ImportedXmlDataProps {
  data: any;
}

const ImportedXmlData: React.FC<ImportedXmlDataProps> = ({ data }) => {
  const formatCurrency = (value: string | number | null | undefined): string => {
    if (!value || isNaN(Number(value))) return 'R$ 0,00';
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatValue = (value: any): string => {
    return value || '—';
  };

  if (!data) {
    return (
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg text-gray-700">Dados Importados do XML</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Nenhum dado XML importado encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados Importados do XML</h2>

      {/* 1. Dados do Cliente */}
      {data.cliente && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="bg-blue-100 border-b border-blue-200">
            <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
              👤 Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-gray-700 w-1/3">Nome</TableCell>
                  <TableCell>{formatValue(data.cliente.nome)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">E-mail</TableCell>
                  <TableCell>{formatValue(data.cliente.email)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">Telefone</TableCell>
                  <TableCell>{formatValue(data.cliente.telefone)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">Situação</TableCell>
                  <TableCell>
                    {data.cliente.situacao ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {data.cliente.situacao}
                      </Badge>
                    ) : '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">Etapa</TableCell>
                  <TableCell>
                    {data.cliente.etapa ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {data.cliente.etapa}
                      </Badge>
                    ) : '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">Ambiente</TableCell>
                  <TableCell>{formatValue(data.cliente.ambiente)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 2. Resumo Financeiro */}
      {data.resumoFinanceiro && Array.isArray(data.resumoFinanceiro) && data.resumoFinanceiro.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="bg-green-100 border-b border-green-200">
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              💰 Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50">
                  <TableHead className="font-medium text-green-800">Tipo</TableHead>
                  <TableHead className="font-medium text-green-800 text-right">Valor (R$)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.resumoFinanceiro.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-gray-700">{formatValue(item.tipo)}</TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={item.valor && Number(item.valor) < 0 ? 'text-red-600' : 'text-green-700'}>
                        {formatCurrency(item.valor)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 3. Ambientes */}
      {data.ambientes && Array.isArray(data.ambientes) && data.ambientes.length > 0 && (
        <div className="space-y-4">
          {data.ambientes.map((ambiente: any, ambienteIndex: number) => (
            <Card key={ambienteIndex} className="border-purple-200 bg-purple-50/50">
              <CardHeader className="bg-purple-100 border-b border-purple-200">
                <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                  🏠 {formatValue(ambiente.nome)}
                </CardTitle>
                {ambiente.descricao && (
                  <p className="text-sm text-purple-700 mt-1">{ambiente.descricao}</p>
                )}
              </CardHeader>
              <CardContent className="p-4">
                {/* Resumo do Ambiente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600">Valor Orçamento</p>
                    <p className="text-lg font-semibold text-purple-700">
                      {formatCurrency(ambiente.valorOrcamento)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600">Valor Pedido</p>
                    <p className="text-lg font-semibold text-purple-700">
                      {formatCurrency(ambiente.valorPedido)}
                    </p>
                  </div>
                </div>

                {/* 4. Itens do Ambiente */}
                {ambiente.componentes && Array.isArray(ambiente.componentes) && ambiente.componentes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                      📋 Itens do Ambiente
                    </h4>
                    <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-purple-50">
                            <TableHead className="font-medium text-purple-800">Descrição</TableHead>
                            <TableHead className="font-medium text-purple-800 text-center">Qtd</TableHead>
                            <TableHead className="font-medium text-purple-800 text-center">Dimensão</TableHead>
                            <TableHead className="font-medium text-purple-800 text-center">Material</TableHead>
                            <TableHead className="font-medium text-purple-800 text-right">Valor Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ambiente.componentes.map((item: any, itemIndex: number) => (
                            <TableRow key={itemIndex}>
                              <TableCell className="font-medium text-gray-700">
                                {formatValue(item.descricao)}
                              </TableCell>
                              <TableCell className="text-center">{formatValue(item.quantidade)}</TableCell>
                              <TableCell className="text-center">{formatValue(item.dimensao)}</TableCell>
                              <TableCell className="text-center">{formatValue(item.material)}</TableCell>
                              <TableCell className="text-right font-mono text-green-700">
                                {formatCurrency(item.valorTotal)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImportedXmlData;
