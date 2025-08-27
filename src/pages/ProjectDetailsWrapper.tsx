
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetails from './ProjectDetails';

const ProjectDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  console.log('🔍 ProjectDetailsWrapper - ID recebido:', id);
  
  const handleBack = () => {
    navigate('/projetos');
  };

  if (!id) {
    console.log('❌ ID não encontrado, redirecionando para /projetos');
    navigate('/projetos');
    return null;
  }

  if (id === ':id') {
    console.log('❌ ID é literal ":id", problema de roteamento');
    navigate('/projetos');
    return null;
  }

  return <ProjectDetails projectId={id} onBack={handleBack} />;
};

export default ProjectDetailsWrapper;
