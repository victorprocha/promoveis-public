import React from 'react';
import { useNavigate } from 'react-router-dom';
import NovoPedidoSaida from './NovoPedidoSaida';

const NovoPedidoSaidaWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/pedidos-saida');
  };

  return <NovoPedidoSaida onBack={handleBack} />;
};

export default NovoPedidoSaidaWrapper;