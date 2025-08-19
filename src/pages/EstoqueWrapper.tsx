import React from 'react';
import { useNavigate } from 'react-router-dom';
import Estoque from './Estoque';

const EstoqueWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddProduct = () => {
    navigate('/produtos/cadastrar');
  };

  const handleViewHistory = (productId: string) => {
    navigate(`/produtos/${productId}/historico`);
  };

  return <Estoque onAddProduct={handleAddProduct} onViewHistory={handleViewHistory} />;
};

export default EstoqueWrapper;