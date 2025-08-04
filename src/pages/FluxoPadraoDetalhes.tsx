import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Info } from 'lucide-react';

interface FluxoPadraoDetalhesProps {
  onBack?: () => void;
}

const FluxoPadraoDetalhes: React.FC<FluxoPadraoDetalhesProps> = ({ onBack }) => {
  const eventos = [
    { nome: 'Assinatura do Contrato', ordem: 10, dias: 0, gera: 'Não Gera Compromisso', controle: false, maxProjeto: false },
    { nome: 'Check-list Comercial do Contrato', ordem: 20, dias: 0, gera: 'Não Gera Compromisso', controle: false, maxProjeto: false },
    { nome: 'Check-list Financeiro do Contrato', ordem: 20, dias: 0, gera: 'Não Gera Compromisso', controle: false, maxProjeto: false },
    { nome: 'Liberação Comercial', ordem: 80, dias: 0, gera: 'Não Gera Compromisso', controle: false, maxProjeto: false },
    { nome: 'Liberação Financeira', ordem: 80, dias: 0, gera: 'Não Gera Compromisso', controle: false, maxProjeto: false },
    { nome: 'Medição dos Ambientes', ordem: 35, dias: 0, gera: 'Não Gera Compromisso', controle: false, maxProjeto: false }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-600">Matriz de Eventos &gt; FLUXO PADRÃO</h1>
        </div>
      </div>

      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="loja" className="text-sm font-medium text-gray-600">Loja / Unidade</Label>
                <Input id="loja" value="LOJA FOCCO LAPIS" readOnly className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="descricao" className="text-sm font-medium text-gray-600">Descrição</Label>
                <Input id="descricao" value="FLUXO PADRÃO" readOnly className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="validade" className="text-sm font-medium text-gray-600">Validade*</Label>
                <div className="flex gap-2 mt-1">
                  <Input value="01/01/2000" readOnly className="flex-1" />
                  <span className="self-center text-gray-500">até</span>
                  <Input value="31/12/9999" readOnly className="flex-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fluxo" className="text-sm font-medium text-gray-600">Fluxo de Trabalho*</Label>
                <Input id="fluxo" value="Fluxo de venda padrão" readOnly className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="tipo-asuroa" className="text-sm font-medium text-gray-600">Tipo de Asuroa</Label>
                <Input id="tipo-asuroa" value="Compromissos" readOnly className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="tipo-compromisso" className="text-sm font-medium text-gray-600">Tipo de Compromisso*</Label>
                <Input id="tipo-compromisso" value="EVENTO" readOnly className="mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eventos Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">Eventos</TableHead>
                <TableHead className="font-medium">Ordem</TableHead>
                <TableHead className="font-medium">Dias Úteis</TableHead>
                <TableHead className="font-medium">Gerar Compromisso para</TableHead>
                <TableHead className="font-medium text-center">Controle</TableHead>
                <TableHead className="font-medium text-center">
                  <div className="flex items-center gap-1">
                    APP MaxProjeto
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((evento, index) => (
                <TableRow key={index} className="border-b">
                  <TableCell className="font-medium">{evento.nome}</TableCell>
                  <TableCell>{evento.ordem}</TableCell>
                  <TableCell>{evento.dias}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-600">
                      {evento.gera}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={evento.controle} disabled />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={evento.maxProjeto} disabled />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          VOLTAR
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            EXCLUIR
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            EDITAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FluxoPadraoDetalhes;