import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users, Settings, FileText, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import PageTemplate from '@/components/Layout/PageTemplate';
import { useCollaborators } from '@/hooks/useCollaborators';

const Compromissos = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStore, setSelectedStore] = useState('Loja de Móveis');
  const [viewType, setViewType] = useState('Semana');
  const [selectedAgendaType, setSelectedAgendaType] = useState('Apresentação');
  const [selectedCollaborator, setSelectedCollaborator] = useState('all');

  // Get collaborators from database
  const { collaborators: dbCollaborators, loading } = useCollaborators();

  // Updated agenda types as requested
  const agendaTypes = [
    'Apresentação',
    'Assistência',
    'Compromissos',
    'Entrega',
    'Medição',
    'Montagem',
    'Tarefa'
  ];

  // Filter collaborators based on selection
  const filteredCollaborators = selectedCollaborator === 'all' 
    ? dbCollaborators 
    : dbCollaborators.filter(collab => collab.id === selectedCollaborator);

  // Generate week days
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <PageTemplate 
      title="Compromissos"
      icon={Calendar}
    >
      <div className="flex gap-6 min-h-screen">
        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Mini Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                classNames={{
                  months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                  month: "space-y-4 w-full flex flex-col",
                  table: "w-full h-full border-collapse space-y-1",
                  head_row: "hidden",
                  head_cell: "hidden",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                  day_range_start: "day-range-start",
                  day_range_end: "day-range-end",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </CardContent>
          </Card>

          {/* Store Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Loja/Unidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar loja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Loja de Móveis">Loja de Móveis</SelectItem>
                  <SelectItem value="Loja Principal">Loja Principal</SelectItem>
                  <SelectItem value="Filial 01">Filial 01</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Agenda Types */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Tipo de Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedAgendaType} onValueChange={setSelectedAgendaType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {agendaTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

           {/* Personnel/Equipment */}
           <Card>
             <CardHeader className="pb-3">
               <CardTitle className="text-base font-medium flex items-center gap-2">
                 <Users className="h-4 w-4" />
                 Pessoas / Equipamentos
               </CardTitle>
             </CardHeader>
             <CardContent>
               {loading ? (
                 <div className="text-sm text-muted-foreground">Carregando colaboradores...</div>
               ) : (
                 <div className="space-y-1 max-h-64 overflow-y-auto">
                   {dbCollaborators.map((collaborator) => (
                     <div
                       key={collaborator.id}
                       className="text-sm p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                       onClick={() => setSelectedCollaborator(collaborator.id)}
                     >
                       {collaborator.name}
                       {collaborator.role && (
                         <span className="text-muted-foreground"> - {collaborator.role}</span>
                       )}
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
           </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header Controls */}
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-lg font-semibold">
                    {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={viewType} onValueChange={setViewType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Visualização" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dia">Dia</SelectItem>
                      <SelectItem value="Semana">Semana</SelectItem>
                      <SelectItem value="Mês">Mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-8 border-b">
                    <div className="p-4 bg-muted font-medium">
                      Colaborador
                    </div>
                    {weekDays.map((date, index) => (
                      <div key={date.toISOString()} className="p-4 bg-muted font-medium text-center border-l">
                        <div className="text-sm text-muted-foreground">
                          {dayNames[index]}
                        </div>
                        <div className="text-lg font-semibold">
                          {date.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                   {/* Collaborator Rows */}
                   {filteredCollaborators.map((collaborator) => (
                     <div key={collaborator.id} className="grid grid-cols-8 border-b">
                       <div className="p-4 bg-muted/50 font-medium border-r">
                         <div className="text-sm text-muted-foreground">{collaborator.role || 'Colaborador'}</div>
                         <div>{collaborator.name}</div>
                       </div>
                        {weekDays.map((date) => (
                          <div 
                            key={date.toISOString()} 
                            className="p-2 border-l h-24 hover:bg-muted/30 cursor-pointer transition-colors relative group"
                          >
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Calendar 
                                className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Clicando no ícone de agenda');
                                  if (onNavigate) {
                                    console.log('Redirecionando para agenda-entrega');
                                    onNavigate('agenda-entrega');
                                  } else {
                                    console.log('onNavigate não definido');
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                     </div>
                   ))}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageTemplate>
  );
};

export default Compromissos;