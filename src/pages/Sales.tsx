
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';

const Sales = () => {
  const [salesData] = useState([
    { id: 'V001', cliente: 'João Silva', data: '15/12/2024', valor: 'R$ 25.000,00', status: 'Finalizada', vendedor: 'Maria Santos' },
    { id: 'V002', cliente: 'Empresa ABC Ltda', data: '14/12/2024', valor: 'R$ 45.000,00', status: 'Em Andamento', vendedor: 'Carlos Oliveira' },
    { id: 'V003', cliente: 'Ana Costa', data: '13/12/2024', valor: 'R$ 12.500,00', status: 'Cancelada', vendedor: 'Pedro Lima' },
  ]);

  const columns = [
    { key: 'id', header: 'ID Venda' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'data', header: 'Data' },
    { key: 'valor', header: 'Valor' },
    { key: 'status', header: 'Status' },
    { key: 'vendedor', header: 'Vendedor' },
  ];

  return (
    <PageTemplate
      title="Vendas"
      icon={ShoppingCart}
      searchPlaceholder="Pesquisar vendas..."
      addButtonText="NOVA VENDA"
      onAddClick={() => console.log('Nova venda')}
    >
      <DataTable
        columns={columns}
        data={salesData}
        emptyMessage="Nenhuma venda encontrada"
      />
    </PageTemplate>
  );
};

export default Sales;
