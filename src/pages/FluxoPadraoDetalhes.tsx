import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Search, CalendarIcon } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useEventMatrix } from '@/hooks/useEventMatrix';
import { cn } from '@/lib/utils';

interface FluxoPadraoDetalhesProps {
  onBack?: () => void;
}

const FluxoPadraoDetalhes: React.FC<FluxoPadraoDetalhesProps> = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState<{[key: number]: string[]}>({});
  
  const { collaborators = [] } = useCollaborators();
  const { eventMatrix, loading, updateEventMatrix, updateEvent } = useEventMatrix();

  const compromissoOptions = [
    'Não Gera Compromisso',
    'Consultor/Técnico Responsável',
    'Colaborador Responsável',
    'Cargo'
  ];

  const handleEventoChange = async (eventId: string, field: string, value: any) => {
    await updateEvent(eventId, { [field]: value });
  };

  const handleMatrixChange = async (field: string, value: any) => {
    await updateEventMatrix({ [field]: value });
  };

  const handleCollaboratorToggle = (eventoIndex: number, collaboratorId: string) => {
    setSelectedCollaborators(prev => {
      const current = prev[eventoIndex] || [];
      const isSelected = current.includes(collaboratorId);
      
      if (isSelected) {
        return {
          ...prev,
          [eventoIndex]: current.filter(id => id !== collaboratorId)
        };
      } else {
        return {
          ...prev,
          [eventoIndex]: [...current, collaboratorId]
        };
      }
    });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!eventMatrix) {
    return <div className="p-6">Matriz de eventos não encontrada.</div>;
  }

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
                  value={eventMatrix.description} 
                  onChange={(e) => handleMatrixChange('description', e.target.value)}
                  readOnly={!isEditing} 
                  className="mt-1" 
                />
              </div>
              
              <div>
                <Label htmlFor="validade" className="text-sm font-medium text-gray-600">Validade*</Label>
                <div className="flex gap-2 mt-1">
                  {isEditing ? (
                    <>
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 justify-start text-left font-normal",
                              !eventMatrix.start_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventMatrix.start_date ? format(new Date(eventMatrix.start_date), "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={eventMatrix.start_date ? new Date(eventMatrix.start_date) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                handleMatrixChange('start_date', format(date, 'yyyy-MM-dd'));
                              }
                              setStartDateOpen(false);
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <span className="self-center text-gray-500">até</span>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 justify-start text-left font-normal",
                              !eventMatrix.end_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventMatrix.end_date ? format(new Date(eventMatrix.end_date), "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={eventMatrix.end_date ? new Date(eventMatrix.end_date) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                handleMatrixChange('end_date', format(date, 'yyyy-MM-dd'));
                              }
                              setEndDateOpen(false);
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </>
                  ) : (
                    <>
                      <Input 
                        value={eventMatrix.start_date ? format(new Date(eventMatrix.start_date), "dd/MM/yyyy", { locale: ptBR }) : ''}
                        readOnly 
                        className="flex-1" 
                      />
                      <span className="self-center text-gray-500">até</span>
                      <Input 
                        value={eventMatrix.end_date ? format(new Date(eventMatrix.end_date), "dd/MM/yyyy", { locale: ptBR }) : ''}
                        readOnly 
                        className="flex-1" 
                      />
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="fluxo" className="text-sm font-medium text-gray-600">Fluxo de Trabalho*</Label>
                <Input id="fluxo" value={eventMatrix.workflow_type} readOnly className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="tipo-agenda" className="text-sm font-medium text-gray-600">Tipo de Agenda</Label>
                {isEditing ? (
                  <Select value={eventMatrix.agenda_type} onValueChange={(value) => handleMatrixChange('agenda_type', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compromissos">Compromissos</SelectItem>
                      <SelectItem value="Tarefa">Tarefa</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="tipo-agenda" value={eventMatrix.agenda_type} readOnly className="mt-1" />
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Eventos</TableHead>
                  <TableHead className="font-medium">Ordem</TableHead>
                  <TableHead className="font-medium">Dias Úteis</TableHead>
                  <TableHead className="font-medium">Gerar Compromisso para</TableHead>
                  <TableHead className="font-medium text-center">Controle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventMatrix.events.map((evento, index) => (
                  <TableRow key={evento.id} className="border-b">
                    <TableCell className="font-medium">{evento.name}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={evento.order_sequence} 
                          onChange={(e) => handleEventoChange(evento.id, 'order_sequence', parseInt(e.target.value) || 0)}
                          className="w-16"
                        />
                      ) : (
                        evento.order_sequence
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input 
                          value={evento.days} 
                          onChange={(e) => handleEventoChange(evento.id, 'days', parseInt(e.target.value) || 0)}
                          className="w-16"
                        />
                      ) : (
                        evento.days
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <Select 
                            value={evento.generates_commitment} 
                            onValueChange={(value) => handleEventoChange(evento.id, 'generates_commitment', value)}
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
                            {evento.generates_commitment}
                          </Badge>
                        )}
                        
                        {evento.generates_commitment !== 'Não Gera Compromisso' && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                                <Search className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Selecionar Colaboradores</h4>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                  {collaborators.map((collaborator) => (
                                    <div key={collaborator.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        checked={selectedCollaborators[index]?.includes(collaborator.id) || false}
                                        onCheckedChange={() => handleCollaboratorToggle(index, collaborator.id)}
                                      />
                                      <span className="text-sm">{collaborator.name}</span>
                                    </div>
                                  ))}
                                </div>
                                {selectedCollaborators[index] && selectedCollaborators[index].length > 0 && (
                                  <div className="pt-2 border-t">
                                    <p className="text-xs text-gray-500">
                                      {selectedCollaborators[index].length} colaborador(es) selecionado(s)
                                    </p>
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={evento.control_enabled} 
                        onCheckedChange={(checked) => handleEventoChange(evento.id, 'control_enabled', checked)}
                        disabled={!isEditing}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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