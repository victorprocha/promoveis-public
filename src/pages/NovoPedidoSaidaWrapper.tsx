import React from 'react';
import { useNavigate } from 'react-router-dom';
import NovoPedidoSaida from './NovoPedidoSaida';

const NovoPedidoSaidaWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/pedidos-saida');
  };

  const handlePedidoCreated = (pedidoId: string) => {
    navigate(`/pedidos-saida/${pedidoId}/editar`);
  };

  return <NovoPedidoSaida onBack={handleBack} onPedidoCreated={handlePedidoCreated} />;
};

export default NovoPedidoSaidaWrapper;