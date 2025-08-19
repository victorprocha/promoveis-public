import React from 'react';
import { useNavigate } from 'react-router-dom';
import CadastroProduto from './CadastroProduto';

const CadastroProdutoWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/estoque');
  };

  return <CadastroProduto onBack={handleBack} />;
};

export default CadastroProdutoWrapper;