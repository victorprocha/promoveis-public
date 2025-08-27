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
  priority: dbProject.priority || 'Normal',
  consultant: 'Consultor Responsável',
  environments: '1',
  columnId: 'assinatura',
  itemsCount: '0/1',
  deliveryDeadline: dbProject.delivery_deadline,
  specifierId: dbProject.specifier_id,
  specifierName: dbProject.specifier_name,
  createdAt: dbProject.created_at,
  updatedAt: dbProject.updated_at
});

export const projectService = {
  async getProject(projectId: string): Promise<any> {
    try {
      console.log('🔍 Buscando projeto com ID:', projectId);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      console.log('✅ Usuário autenticado:', user.email);

      // Buscar projeto com dados do especificador e dados XML
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          specifiers!projects_specifier_id_fkey (
            id,
            nome
          ),
          project_xml_data (
            *
          )
        `)
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw new Error(error.message);
      }

      if (!project) {
        console.error('❌ Projeto não encontrado');
        throw new Error('Projeto não encontrado');
      }

      console.log('✅ Projeto encontrado:', project.name);
      console.log('📊 Dados XML:', project.project_xml_data);

      // Mapear projeto para o formato esperado pelo useProject hook
      const mappedProject: any = {
        id: project.id,
        name: project.name,
        description: project.description,
        status: 'Normal' as 'Normal' | 'Pendente' | 'Atrasado' | 'Concluído',
        environment: project.etapa_atual || 'Não definido',
        startDate: project.created_at,
        endDate: project.delivery_deadline,
        environments: [], // Pode ser expandido futuramente
        n8nData: null
      };

      // Processar dados XML se existirem
      if (project.project_xml_data && project.project_xml_data.length > 0) {
        const xmlData = project.project_xml_data[0];
        console.log('🔄 Processando dados XML:', xmlData);
        
        // Parse do JSON se necessário - com verificações de null
        let ambienteData;
        if (xmlData && typeof xmlData === 'object' && xmlData !== null && 'ambiente_data' in xmlData) {
          if (typeof xmlData.ambiente_data === 'string') {
            try {
              ambienteData = JSON.parse(xmlData.ambiente_data);
              console.log('✅ Parse do ambiente_data realizado com sucesso');
            } catch (e) {
              console.error('❌ Erro ao fazer parse do ambiente_data:', e);
              ambienteData = null;
            }
          } else if (xmlData.ambiente_data && typeof xmlData.ambiente_data === 'object') {
            ambienteData = xmlData.ambiente_data;
            console.log('✅ Ambiente_data já é um objeto');
          }

          if (ambienteData) {
            mappedProject.n8nData = {
              cliente: ambienteData.cliente,
              resumoFinanceiro: ambienteData.resumoFinanceiro,
              ambientes: ambienteData.ambientes
            };
            console.log('✅ n8nData configurado:', mappedProject.n8nData);
          }
        } else {
          console.log('⚠️ XML data não contém ambiente_data válido');
        }
      } else {
        console.log('ℹ️ Nenhum dado XML encontrado para este projeto');
      }

      // Adicionar nome do especificador se existir
      if (project.specifiers) {
        mappedProject.specifierName = project.specifiers.nome;
        console.log('✅ Nome do especificador adicionado:', project.specifiers.nome);
      }

      console.log('🎉 Projeto mapeado com sucesso:', mappedProject.name);
      return mappedProject;
    } catch (error) {
      console.error('💥 Erro ao buscar projeto:', error);
      throw error;
    }
  },

  async getKanbanProjects(): Promise<KanbanColumn[]> {
    try {
      // Buscar projetos com dados do especificador
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          specifiers!projects_specifier_id_fkey (
            id,
            nome
          )
        `)
        .order('created_at', { ascending: false });

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

      // Mapear projetos para as colunas
      if (projects) {
        const mappedProjects = projects.map(project => {
          const mapped = mapDatabaseToProject(project);
          // Adicionar nome do especificador se existir
          if (project.specifiers) {
            mapped.specifierName = project.specifiers.nome;
          }
          return mapped;
        });
        
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
          priority: data.priority || 'Normal',
          budget: null,
          deadline: null,
          delivery_deadline: data.deliveryDeadline || null,
          specifier_id: data.specifierId || null
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

  async createSimpleProject(data: {
    title: string;
    clientName: string;
    description?: string;
    consultant?: string;
    environments?: string;
    priority?: string;
    deliveryDeadline?: string;
    specifierId?: string;
  }): Promise<ApiResponse<Project>> {
    try {
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Criando projeto com dados:', data);

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: data.title,
          client_name: data.clientName,
          client_email: '',
          client_phone: '',
          description: data.description || null,
          priority: data.priority || 'Normal',
          budget: null,
          deadline: null,
          delivery_deadline: data.deliveryDeadline || null,
          specifier_id: data.specifierId || null
        })
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw new Error(error.message);
      }

      console.log('Projeto criado:', project);

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
  },

  async updateProject(projectId: string, data: UpdateProjectData): Promise<ApiResponse<Project>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update({
          name: data.title,
          description: data.description,
          priority: data.priority,
          delivery_deadline: data.deliveryDeadline || null,
          specifier_id: data.specifierId || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: mapDatabaseToProject(project),
        message: 'Projeto atualizado com sucesso',
        success: true
      };
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  },

  async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: undefined,
        message: 'Projeto excluído com sucesso',
        success: true
      };
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      throw error;
    }
  }
};
