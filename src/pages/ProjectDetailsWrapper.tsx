import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetails from './ProjectDetails';

const ProjectDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/projetos');
  };

  if (!id) {
    navigate('/projetos');
    return null;
  }

  return <ProjectDetails projectId={id} onBack={handleBack} />;
};

export default ProjectDetailsWrapper;