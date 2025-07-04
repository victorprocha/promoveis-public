
import { supabase } from '@/integrations/supabase/client';
import { Project, CreateProjectData, UpdateProjectData, KanbanColumn } from '@/types/project';
import { ApiResponse } from '@/types/common';

// Mapear dados do banco para o tipo da aplicação
const mapDatabaseToProject = (dbProject: any): Project => ({
  id: dbProject.id,
  title: dbProject.name,
  clientId: dbProject.client_id || '',
  clientName: dbProject.client_name || 'Cliente não informado',
  projectNumber: `PROJ-${dbProject.id.slice(-6)}`,
  description: dbProject.description,
  status: 'Normal',
  priority: 'Normal',
  consultant: 'Consultor Responsável',
  environments: '1',
  columnId: 'assinatura',
  itemsCount: '0/1',
  createdAt: dbProject.created_at,
  updatedAt: dbProject.updated_at
});

export const projectService = {
  async getKanbanProjects(): Promise<KanbanColumn[]> {
    try {
      // Buscar projetos diretamente (sem join, pois client_name já está na tabela)
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      const columns: KanbanColumn[] = [
        { id: 'assinatura', title: 'Assinatura do Contrato', projects: [] },
        { id: 'medicao', title: 'Medição dos Ambientes', projects: [] },
        { id: 'revisao', title: 'Revisão dos Ambientes', projects: [] },
        { id: 'compra', title: 'Compra dos Itens dos Ambientes', projects: [] },
        { id: 'entrega', title: 'Entrega dos Ambientes', projects: [] },
        { id: 'montagem', title: 'Montagem', projects: [] }
      ];

      // Mapear projetos para as colunas (por enquanto todos vão para 'assinatura')
      if (projects) {
        const mappedProjects = projects.map(project => 
          mapDatabaseToProject(project)
        );
        
        // Por enquanto, colocar todos os projetos na primeira coluna
        columns[0].projects = mappedProjects;
      }

      return columns;
    } catch (error) {
      console.error('Erro ao buscar projetos kanban:', error);
      throw error;
    }
  },

  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    try {
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar o nome do cliente
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('name')
        .eq('id', data.clientId)
        .single();

      if (clientError || !client) {
        throw new Error('Cliente não encontrado');
      }

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: data.title,
          client_name: client.name,
          client_email: '',
          client_phone: '',
          description: data.description,
          budget: null,
          deadline: null
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: mapDatabaseToProject(project),
        message: 'Projeto criado com sucesso',
        success: true
      };
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  },

  async updateProjectStatus(projectId: string, newColumnId: string): Promise<ApiResponse<Project>> {
    try {
      // Por enquanto, apenas retornamos sucesso sem alterar no banco
      // Isso pode ser expandido futuramente com uma coluna de status
      console.log(`Projeto ${projectId} movido para coluna ${newColumnId}`);

      // Buscar o projeto atual para retornar
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const updatedProject = mapDatabaseToProject(project);
      updatedProject.columnId = newColumnId;

      return {
        data: updatedProject,
        message: 'Status do projeto atualizado',
        success: true
      };
    } catch (error) {
      console.error('Erro ao atualizar status do projeto:', error);
      throw error;
    }
  }
};
