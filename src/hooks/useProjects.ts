
import { useState, useEffect, useCallback } from 'react';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';
import { LoadingState } from '@/types/common';
import { useToast } from '@/hooks/use-toast';

export const useProjects = () => {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setLoading('loading');
    setError(null);
    
    try {
      const kanbanData = await projectService.getKanbanProjects();
      // Flatten all projects from all columns
      const allProjects = kanbanData.flatMap(column => column.projects);
      setData(allProjects);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
      setLoading('error');
      toast({
        title: "Erro",
        description: "Erro ao carregar projetos",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refetch = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Método para adicionar um projeto à lista sem refazer toda a busca
  const addProject = useCallback((newProject: Project) => {
    setData(prevData => [newProject, ...prevData]);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    addProject
  };
};
