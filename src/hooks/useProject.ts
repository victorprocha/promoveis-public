
import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'Normal' | 'Pendente' | 'Atrasado' | 'Concluído';
  environment?: string;
  startDate?: string;
  endDate?: string;
  environments?: ProjectEnvironment[];
  n8nData?: any;
}

export interface ProjectEnvironment {
  id: string;
  name: string;
  description?: string;
}

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    if (!projectId) {
      console.log('⚠️ ProjectId não fornecido');
      return;
    }
    
    try {
      console.log('🚀 Iniciando busca do projeto:', projectId);
      setLoading('loading');
      setError(null);
      
      const projectData = await projectService.getProject(projectId);
      console.log('📦 Dados do projeto recebidos:', projectData);
      
      setProject(projectData);
      setLoading('loaded');
      console.log('✅ Estado atualizado para loaded');
    } catch (err) {
      console.error('💥 Erro no useProject:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
      setError(errorMessage);
      setLoading('error');
      console.log('❌ Estado atualizado para error:', errorMessage);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect executado com projectId:', projectId);
    fetchProject();
  }, [projectId]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject
  };
};
