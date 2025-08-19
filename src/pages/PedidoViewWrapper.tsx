import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PedidoView from './PedidoView';

const PedidoViewWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  if (!id) {
    navigate('/pedidos-compra');
    return null;
  }

  return <PedidoView orderId={id} />;
};

export default PedidoViewWrapper;