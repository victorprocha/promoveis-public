
export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  projectNumber: string;
  description?: string;
  status: 'Normal' | 'Pendente' | 'Atrasado' | 'Concluído';
  priority: 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
  consultant: string;
  environments: string;
  columnId: string;
  itemsCount: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  clientId: string;
  description?: string;
  priority: 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
  consultant: string;
  environments: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: 'Normal' | 'Pendente' | 'Atrasado' | 'Concluído';
  columnId?: string;
}

export interface ProjectFilters {
  search?: string;
  status?: 'Normal' | 'Pendente' | 'Atrasado' | 'Concluído';
  consultant?: string;
  page?: number;
  limit?: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  projects: Project[];
}
