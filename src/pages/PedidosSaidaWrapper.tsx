import React from 'react';
import { useNavigate } from 'react-router-dom';
import PedidosSaida from './PedidosSaida';

const PedidosSaidaWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddPedidoSaida = () => {
    navigate('/pedidos-saida/novo');
  };

  return <PedidosSaida onAddPedidoSaida={handleAddPedidoSaida} />;
};

export default PedidosSaidaWrapper;