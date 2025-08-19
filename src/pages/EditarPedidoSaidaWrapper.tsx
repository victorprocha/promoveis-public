import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditarPedidoSaida from './EditarPedidoSaida';

const EditarPedidoSaidaWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/pedidos-saida');
  };

  if (!id) {
    navigate('/pedidos-saida');
    return null;
  }

  return <EditarPedidoSaida pedidoId={id} onBack={handleBack} />;
};

export default EditarPedidoSaidaWrapper;