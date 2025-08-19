import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditarPedido from './EditarPedido';

const EditarPedidoWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/pedidos-compra');
  };

  if (!id) {
    navigate('/pedidos-compra');
    return null;
  }

  return <EditarPedido orderId={id} onBack={handleBack} />;
};

export default EditarPedidoWrapper;