import React, { useState } from 'react';
import { Calendar, MapPin, Users, FileText, Package, Truck, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PageTemplate from '@/components/Layout/PageTemplate';

const AgendaEntrega = () => {
  const [selectedStore, setSelectedStore] = useState('Loja de Móveis');
  const [agendaType, setAgendaType] = useState('Entrega');
  const [situacaoAgendamento, setSituacaoAgendamento] = useState('Com entrega pendente de agendamento');
  const [cliente, setCliente] = useState('');
  const [projeto, setProjeto] = useState('');
  const [contrato, setContrato] = useState('');

  // Estado dos checkboxes
  const [checkboxes, setCheckboxes] = useState({
    incluido: false,
    contratoRevisado: false,
    emPedido: false,
    apresentado: false,
    entregaConcluida: false,
    aprovado: false,
    montagemConcluida: false,
    emContrato: false,
    projetoConcluido: false
  });

  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Dados mock para a tabela
  const deliveries = [
    {
      id: 1,
      cliente: 'DIOGO SILVA COSTA',
      telefone: '43 5454-5656',
      projeto: 'DIOGO SILVA COSTA - 07/02/20',
      responsavel: 'Vinicius Lisboa',
      contrato: '92401',
      prioridade: '0 de 1',
      agendados: '',
      loja: 'Loja de Móveis'
    },
    // Add more rows as needed...
  ];

  return (
    <PageTemplate 
      title="Entrega"
      icon={Truck}
    >
      <div className="p-6 space-y-6">
        {/* Formulário Superior */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Agendamento de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primeira linha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Loja/Unidade</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Loja de Móveis">Loja de Móveis</SelectItem>
                    <SelectItem value="Loja Principal">Loja Principal</SelectItem>
                    <SelectItem value="Filial 01">Filial 01</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Agenda</Label>
                <Select value={agendaType} onValueChange={setAgendaType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrega">Entrega</SelectItem>
                    <SelectItem value="Apresentação">Apresentação</SelectItem>
                    <SelectItem value="Assistência">Assistência</SelectItem>
                    <SelectItem value="Medição">Medição</SelectItem>
                    <SelectItem value="Montagem">Montagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Situação de Agendamento</Label>
                <Select value={situacaoAgendamento} onValueChange={setSituacaoAgendamento}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Com entrega pendente de agendamento">Com entrega pendente de agendamento</SelectItem>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Segunda linha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cliente</Label>
                <Input 
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Projeto</Label>
                <Input 
                  value={projeto}
                  onChange={(e) => setProjeto(e.target.value)}
                  placeholder="Nome do projeto"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contrato</Label>
                <Input 
                  value={contrato}
                  onChange={(e) => setContrato(e.target.value)}
                  placeholder="Número do contrato"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluido"
                  checked={checkboxes.incluido}
                  onCheckedChange={() => handleCheckboxChange('incluido')}
                />
                <Label htmlFor="incluido" className="text-sm">Incluído</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contratoRevisado"
                  checked={checkboxes.contratoRevisado}
                  onCheckedChange={() => handleCheckboxChange('contratoRevisado')}
                />
                <Label htmlFor="contratoRevisado" className="text-sm">Contrato Revisado</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emPedido"
                  checked={checkboxes.emPedido}
                  onCheckedChange={() => handleCheckboxChange('emPedido')}
                />
                <Label htmlFor="emPedido" className="text-sm">Em Pedido</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="apresentado"
                  checked={checkboxes.apresentado}
                  onCheckedChange={() => handleCheckboxChange('apresentado')}
                />
                <Label htmlFor="apresentado" className="text-sm">Apresentado</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="entregaConcluida"
                  checked={checkboxes.entregaConcluida}
                  onCheckedChange={() => handleCheckboxChange('entregaConcluida')}
                />
                <Label htmlFor="entregaConcluida" className="text-sm">Entrega Concluída</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="aprovado"
                  checked={checkboxes.aprovado}
                  onCheckedChange={() => handleCheckboxChange('aprovado')}
                />
                <Label htmlFor="aprovado" className="text-sm">Aprovado</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="montagemConcluida"
                  checked={checkboxes.montagemConcluida}
                  onCheckedChange={() => handleCheckboxChange('montagemConcluida')}
                />
                <Label htmlFor="montagemConcluida" className="text-sm">Montagem Concluída</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emContrato"
                  checked={checkboxes.emContrato}
                  onCheckedChange={() => handleCheckboxChange('emContrato')}
                />
                <Label htmlFor="emContrato" className="text-sm">Em Contrato</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="projetoConcluido"
                  checked={checkboxes.projetoConcluido}
                  onCheckedChange={() => handleCheckboxChange('projetoConcluido')}
                />
                <Label htmlFor="projetoConcluido" className="text-sm">Projeto Concluído</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Entregas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Lista de Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Agendados/Ambientes</TableHead>
                    <TableHead>Loja/Unidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{delivery.cliente}</TableCell>
                      <TableCell>{delivery.telefone}</TableCell>
                      <TableCell>
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {delivery.projeto}
                        </span>
                      </TableCell>
                      <TableCell>{delivery.responsavel}</TableCell>
                      <TableCell>
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {delivery.contrato}
                        </span>
                      </TableCell>
                      <TableCell>{delivery.prioridade}</TableCell>
                      <TableCell>{delivery.agendados}</TableCell>
                      <TableCell>{delivery.loja}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default AgendaEntrega;