
import { Project, CreateProjectData, UpdateProjectData, ProjectFilters, KanbanColumn } from '@/types/project';
import { ApiResponse } from '@/types/common';

// Mock data para projetos
const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Projeto Cozinha Maria Silva',
    clientId: '1',
    clientName: 'Maria Silva',
    projectNumber: '12345',
    description: 'Projeto de cozinha planejada',
    status: 'Normal',
    priority: 'Normal',
    consultant: 'Maria Oliveira',
    environments: '1',
    columnId: 'assinatura',
    itemsCount: '0/1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'proj-2',
    title: 'Projeto Escritório João Santos',
    clientId: '2',
    clientName: 'João Santos',
    projectNumber: '12346',
    description: 'Móveis para escritório corporativo',
    status: 'Pendente',
    priority: 'Alta',
    consultant: 'Carlos Santos',
    environments: '3',
    columnId: 'assinatura',
    itemsCount: '0/3',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: 'proj-3',
    title: 'Projeto Quarto Ana Costa',
    clientId: '3',
    clientName: 'Ana Costa',
    projectNumber: '12347',
    description: 'Quarto planejado completo',
    status: 'Normal',
    priority: 'Normal',
    consultant: 'Roberto Lima',
    environments: '8',
    columnId: 'medicao',
    itemsCount: '2/8',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 'proj-4',
    title: 'Projeto Casa Carlos Lima',
    clientId: '4',
    clientName: 'Carlos Lima',
    projectNumber: '12348',
    description: 'Móveis para casa completa',
    status: 'Atrasado',
    priority: 'Urgente',
    consultant: 'Fernanda Souza',
    environments: '5',
    columnId: 'revisao',
    itemsCount: '1/5',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getKanbanProjects(): Promise<KanbanColumn[]> {
    await delay(600);

    const columns: KanbanColumn[] = [
      { id: 'assinatura', title: 'Assinatura do Contrato', projects: [] },
      { id: 'medicao', title: 'Medição dos Ambientes', projects: [] },
      { id: 'revisao', title: 'Revisão dos Ambientes', projects: [] },
      { id: 'compra', title: 'Compra dos Itens dos Ambientes', projects: [] },
      { id: 'entrega', title: 'Entrega dos Ambientes', projects: [] },
      { id: 'montagem', title: 'Montagem', projects: [] }
    ];

    // Agrupar projetos por coluna
    mockProjects.forEach(project => {
      const column = columns.find(col => col.id === project.columnId);
      if (column) {
        column.projects.push(project);
      }
    });

    return columns;
  },

  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    await delay(500);

    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      clientId: data.clientId,
      clientName: 'Cliente Exemplo', // Em produção, buscar nome pelo clientId
      projectNumber: Math.random().toString().substr(2, 5),
      description: data.description,
      status: 'Normal',
      priority: data.priority,
      consultant: data.consultant,
      environments: data.environments,
      columnId: 'assinatura', // Novos projetos começam na primeira coluna
      itemsCount: '0/1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockProjects.unshift(newProject);

    return {
      data: newProject,
      message: 'Projeto criado com sucesso',
      success: true
    };
  },

  async updateProjectStatus(projectId: string, newColumnId: string): Promise<ApiResponse<Project>> {
    await delay(300);

    const projectIndex = mockProjects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Projeto não encontrado');
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      columnId: newColumnId,
      updatedAt: new Date().toISOString()
    };

    mockProjects[projectIndex] = updatedProject;

    return {
      data: updatedProject,
      message: 'Status do projeto atualizado',
      success: true
    };
  }
};
