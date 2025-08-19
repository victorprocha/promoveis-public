import React from 'react';
import { useNavigate } from 'react-router-dom';
import CadastroUsuario from './CadastroUsuario';

const CadastroUsuarioWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/usuarios');
  };

  return <CadastroUsuario onBack={handleBack} />;
};

export default CadastroUsuarioWrapper;