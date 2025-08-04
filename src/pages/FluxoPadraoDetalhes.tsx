import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Info } from 'lucide-react';

interface FluxoPadraoDetalhesProps {
  onBack?: () => void;
}

const FluxoPadraoDetalhes: React.FC<FluxoPadraoDetalhesProps> = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [descricao, setDescricao] = useState("FLUXO PADRÃO");
  const [dataInicial, setDataInicial] = useState("01/01/2000");
  const [dataFinal, setDataFinal] = useState("31/12/9999");
  const [tipoAgenda, setTipoAgenda] = useState("Compromissos");
  
  const [eventos, setEventos] = useState([
    { nome: 'Assinatura do Contrato', ordem: 10, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Check-list Comercial do Contrato', ordem: 20, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Check-list Financeiro do Contrato', ordem: 20, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Liberação Comercial', ordem: 30, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Liberação Financeira', ordem: 30, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Medição dos Ambientes', ordem: 35, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Revisão dos Ambientes', ordem: 40, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Assinatura da Pasta Executiva', ordem: 45, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Compra dos Itens dos Ambientes', ordem: 50, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Produção dos Itens dos Ambientes', ordem: 55, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Liberação de Obra', ordem: 55, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Entrega dos Ambientes', ordem: 60, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Montagem dos Ambientes', ordem: 70, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Entrega Técnica', ordem: 75, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true },
    { nome: 'Conclusão do Contrato', ordem: 80, dias: 0, gera: 'Não Gera Compromisso', controle: true, maxProjeto: true }
  ]);

  const compromissoOptions = [
    'Não Gera Compromisso',
    'Consultor/Técnico Responsável',
    'Colaborador Responsável',
    'Cargo'
  ];

  const handleEventoChange = (index: number, field: string, value: any) => {
    setEventos(prev => prev.map((evento, i) => 
      i === index ? { ...evento, [field]: value } : evento
    ));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

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
                <Input 
                  id="descricao" 
                  value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)}
                  readOnly={!isEditing} 
                  className="mt-1" 
                />
              </div>
              
              <div>
                <Label htmlFor="validade" className="text-sm font-medium text-gray-600">Validade*</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={dataInicial} 
                    onChange={(e) => setDataInicial(e.target.value)}
                    readOnly={!isEditing} 
                    className="flex-1" 
                  />
                  <span className="self-center text-gray-500">até</span>
                  <Input 
                    value={dataFinal} 
                    onChange={(e) => setDataFinal(e.target.value)}
                    readOnly={!isEditing} 
                    className="flex-1" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fluxo" className="text-sm font-medium text-gray-600">Fluxo de Trabalho*</Label>
                <Input id="fluxo" value="Fluxo de venda padrão" readOnly className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="tipo-agenda" className="text-sm font-medium text-gray-600">Tipo de Agenda</Label>
                {isEditing ? (
                  <Select value={tipoAgenda} onValueChange={setTipoAgenda}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compromissos">Compromissos</SelectItem>
                      <SelectItem value="Tarefa">Tarefa</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="tipo-agenda" value={tipoAgenda} readOnly className="mt-1" />
                )}
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
                  <TableCell>
                    {isEditing ? (
                      <Input 
                        value={evento.ordem} 
                        onChange={(e) => handleEventoChange(index, 'ordem', parseInt(e.target.value) || 0)}
                        className="w-16"
                      />
                    ) : (
                      evento.ordem
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input 
                        value={evento.dias} 
                        onChange={(e) => handleEventoChange(index, 'dias', parseInt(e.target.value) || 0)}
                        className="w-16"
                      />
                    ) : (
                      evento.dias
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Select 
                        value={evento.gera} 
                        onValueChange={(value) => handleEventoChange(index, 'gera', value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {compromissoOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        {evento.gera}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={evento.controle} 
                      onCheckedChange={(checked) => handleEventoChange(index, 'controle', checked)}
                      disabled={!isEditing}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={evento.maxProjeto} 
                      onCheckedChange={(checked) => handleEventoChange(index, 'maxProjeto', checked)}
                      disabled={!isEditing}
                    />
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
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                CANCELAR
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleSave}>
                SALVAR
              </Button>
            </>
          ) : (
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setIsEditing(true)}>
              EDITAR
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FluxoPadraoDetalhes;