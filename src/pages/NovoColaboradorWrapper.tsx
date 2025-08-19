import React from 'react';
import { useNavigate } from 'react-router-dom';
import NovoColaborador from './NovoColaborador';

const NovoColaboradorWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/colaboradores');
  };

  return <NovoColaborador onBack={handleBack} />;
};

export default NovoColaboradorWrapper;