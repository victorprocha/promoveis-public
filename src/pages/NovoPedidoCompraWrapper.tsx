import React from 'react';
import { useNavigate } from 'react-router-dom';
import NovoPedidoCompra from './NovoPedidoCompra';

const NovoPedidoCompraWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/pedidos-compra');
  };

  const handleOrderCreated = () => {
    navigate('/pedidos-compra');
  };

  return <NovoPedidoCompra onBack={handleBack} onOrderCreated={handleOrderCreated} />;
};

export default NovoPedidoCompraWrapper;