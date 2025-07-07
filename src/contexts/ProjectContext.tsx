
import React, { createContext, useContext, ReactNode } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';
import { LoadingState } from '@/types/common';

interface ProjectContextType {
  data: Project[];
  loading: LoadingState;
  error: string | null;
  refetch: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const projectsData = useProjects();

  return (
    <ProjectContext.Provider value={projectsData}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
