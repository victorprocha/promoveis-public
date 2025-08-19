import React from 'react';
import { useNavigate } from 'react-router-dom';
import Colaboradores from './Colaboradores';

const ColaboradoresWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNewColaborador = () => {
    navigate('/colaboradores/novo');
  };

  return <Colaboradores onNewColaborador={handleNewColaborador} />;
};

export default ColaboradoresWrapper;