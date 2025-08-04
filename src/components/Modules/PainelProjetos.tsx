import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Package, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProjectHistoryDialog from '@/components/Dialogs/ProjectHistoryDialog';

// Etapas fixas do processo
const ETAPAS_FIXAS = [
  'Assinatura do Projeto',
  'Checklist Financeiro do Contrato',
  'Checklist Comercial do Contrato',
  'Liberação Financeira',
  'Liberação Comercial',
  'Medição do Ambiente',
  'Revisão dos Ambientes',
  'Assinatura da Pasta Executiva',
  'Compra dos Itens dos Ambientes',
  'Produção dos Itens do Ambiente',
  'Liberação de Obra',
  'Entrega dos Ambientes',
  'Montagem dos Ambientes',
  'Entrega Técnica',
  'Conclusão de Contrato'
];

interface Projeto {
  id: string;
  name: string;
  client_name: string;
  priority: string;
  etapa_atual: string;
  budget: number;
  deadline: string;
  specifier_id?: string;
  created_at: string;
}

interface ProjetoDetalhado extends Projeto {
  consultor_responsavel?: string;
  valor_venda: number;
}

interface KanbanColumnProps {
  etapa: string;
  projetos: ProjetoDetalhado[];
  onProjectClick?: (projeto: ProjetoDetalhado) => void;
  onCompleteStage?: (projeto: ProjetoDetalhado) => void;
}

interface ProjectCardProps {
  projeto: ProjetoDetalhado;
  onProjectClick?: (projeto: ProjetoDetalhado) => void;
  onCompleteStage?: (projeto: ProjetoDetalhado) => void;
}

// Componente do cartão de projeto
const ProjectCard: React.FC<ProjectCardProps> = ({ projeto, onProjectClick, onCompleteStage }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgente':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'alta':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCurrentStageIndex = () => {
    return ETAPAS_FIXAS.indexOf(projeto.etapa_atual);
  };

  const isLastStage = getCurrentStageIndex() === ETAPAS_FIXAS.length - 1;

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Card clicado:', projeto.name);
              console.log('onProjectClick function:', onProjectClick);
              onProjectClick?.(projeto);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{projeto.name}</h3>
              <Badge className={`text-xs px-2 py-1 ${getPriorityColor(projeto.priority)}`}>
                {projeto.priority}
              </Badge>
            </div>
            
            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Cliente:</span> {projeto.client_name}
              </div>
              {projeto.consultor_responsavel && (
                <div>
                  <span className="font-medium">Consultor:</span> {projeto.consultor_responsavel}
                </div>
              )}
              <div>
                <span className="font-medium">Valor:</span> {formatCurrency(projeto.valor_venda || projeto.budget || 0)}
              </div>
            </div>
          </div>

          {/* Botão para concluir etapa */}
          {!isLastStage && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteStage?.(projeto);
                }}
              >
                <CheckCircle className="h-3 w-3" />
                Concluir Etapa
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente da coluna Kanban
const KanbanColumn: React.FC<KanbanColumnProps> = ({ etapa, projetos, onProjectClick, onCompleteStage }) => {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-4 min-h-[600px] w-80">
      {/* Cabeçalho da coluna */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2">{etapa}</h3>
        <Badge variant="secondary" className="text-xs">
          {projetos.length}
        </Badge>
      </div>

      {/* Lista de projetos */}
      <div className="flex-1 space-y-3">
        {projetos.map((projeto) => (
          <ProjectCard 
            key={projeto.id} 
            projeto={projeto} 
            onProjectClick={onProjectClick}
            onCompleteStage={onCompleteStage}
          />
        ))}
        
        {projetos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-500">Nenhum projeto nesta etapa</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface PainelProjetosProps {
  onNewProject?: () => void;
}

const PainelProjetos: React.FC<PainelProjetosProps> = ({ onNewProject }) => {
  const [projetos, setProjetos] = useState<ProjetoDetalhado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    cliente: 'todos',
    consultor: 'todos-consultores',
    unidade: '',
    busca: ''
  });
  const [clientes, setClientes] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjetoDetalhado | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const { toast } = useToast();

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar projetos
      const { data: projetosData, error: projetosError } = await supabase
        .from('projects')
        .select('*');

      if (projetosError) throw projetosError;

      // Carregar clientes para o filtro
      const { data: clientesData, error: clientesError } = await supabase
        .from('clients')
        .select('id, name');

      if (clientesError) throw clientesError;

      // Mapear dados dos projetos
      const projetosFormatados: ProjetoDetalhado[] = projetosData?.map(projeto => ({
        id: projeto.id,
        name: projeto.name,
        client_name: projeto.client_name,
        priority: projeto.priority || 'Normal',
        etapa_atual: (projeto as any).etapa_atual || 'Assinatura do Projeto',
        budget: projeto.budget || 0,
        deadline: projeto.deadline,
        specifier_id: projeto.specifier_id,
        created_at: projeto.created_at,
        consultor_responsavel: 'Consultor Padrão',
        valor_venda: projeto.budget || 0
      })) || [];

      setProjetos(projetosFormatados);
      setClientes(clientesData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Ocorreu um erro ao carregar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStage = async (projeto: ProjetoDetalhado) => {
    const currentIndex = ETAPAS_FIXAS.indexOf(projeto.etapa_atual);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= ETAPAS_FIXAS.length) {
      toast({
        title: "Projeto já está na última etapa",
        description: "Este projeto já foi concluído.",
        variant: "destructive",
      });
      return;
    }

    const novaEtapa = ETAPAS_FIXAS[nextIndex];

    try {
      // Atualizar projeto no banco
      const { error } = await supabase
        .from('projects')
        .update({ etapa_atual: novaEtapa } as any)
        .eq('id', projeto.id);

      if (error) throw error;

      // Atualizar estado local
      setProjetos(prev => prev.map(p => 
        p.id === projeto.id 
          ? { ...p, etapa_atual: novaEtapa }
          : p
      ));

      toast({
        title: "Etapa concluída",
        description: `Projeto movido para: ${novaEtapa}`,
      });

    } catch (error) {
      console.error('Erro ao concluir etapa:', error);
      toast({
        title: "Erro ao concluir etapa",
        description: "Ocorreu um erro ao atualizar o projeto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const projetosFiltrados = projetos.filter(projeto => {
    const matchBusca = !filtros.busca || 
      projeto.name.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      projeto.client_name.toLowerCase().includes(filtros.busca.toLowerCase());
    
    const matchCliente = filtros.cliente === 'todos' || filtros.cliente === '' || projeto.client_name === filtros.cliente;
    const matchConsultor = filtros.consultor === 'todos-consultores' || filtros.consultor === '' || projeto.consultor_responsavel === filtros.consultor;
    
    return matchBusca && matchCliente && matchConsultor;
  });

  const getProjetosPorEtapa = (etapa: string) => {
    return projetosFiltrados.filter(projeto => projeto.etapa_atual === etapa);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Painel de Projetos</h1>
          </div>
        </div>
        
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projetos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Painel de Projetos</h1>
          </div>
          <Button 
            onClick={onNewProject}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex-1 max-w-xs">
            <Input
              placeholder="Buscar projetos..."
              value={filtros.busca}
              onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
              className="h-8"
            />
          </div>

          <Select value={filtros.cliente} onValueChange={(value) => setFiltros(prev => ({ ...prev, cliente: value === 'todos' ? '' : value }))}>
            <SelectTrigger className="w-48 h-8">
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os clientes</SelectItem>
              {clientes.map(cliente => (
                <SelectItem key={cliente.id} value={cliente.name}>
                  {cliente.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtros.consultor} onValueChange={(value) => setFiltros(prev => ({ ...prev, consultor: value === 'todos-consultores' ? '' : value }))}>
            <SelectTrigger className="w-48 h-8">
              <SelectValue placeholder="Todos os consultores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos-consultores">Todos os consultores</SelectItem>
              <SelectItem value="Consultor Padrão">Consultor Padrão</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board - Visualização Horizontal */}
      <div className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div className="flex gap-4 pb-4 min-w-max">
            {ETAPAS_FIXAS.map((etapa) => (
              <KanbanColumn
                key={etapa}
                etapa={etapa}
                projetos={getProjetosPorEtapa(etapa)}
                onProjectClick={(projeto) => {
                  console.log('onProjectClick sendo executado para:', projeto.name);
                  console.log('Estado atual - isHistoryDialogOpen:', isHistoryDialogOpen);
                  setSelectedProject(projeto);
                  setIsHistoryDialogOpen(true);
                  console.log('Dialog definido para abrir. Novo estado deve ser true');
                }}
                onCompleteStage={handleCompleteStage}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Dialog de Histórico do Projeto */}
      <ProjectHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        projeto={selectedProject}
      />
    </div>
  );
};

export default PainelProjetos;