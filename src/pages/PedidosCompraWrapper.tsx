import React from 'react';
import { useNavigate } from 'react-router-dom';
import PedidosCompra from './PedidosCompra';

const PedidosCompraWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddPedido = () => {
    navigate('/pedidos-compra/novo');
  };

  return <PedidosCompra onAddPedido={handleAddPedido} />;
};

export default PedidosCompraWrapper;