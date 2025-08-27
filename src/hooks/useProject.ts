
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
    if (!projectId) return;
    
    try {
      setLoading('loading');
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
      setLoading('loaded');
    } catch (err) {
      setError('Failed to load project');
      setLoading('error');
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject
  };
};
