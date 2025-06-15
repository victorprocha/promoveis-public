
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';

const Deliveries = () => {
  const [deliveriesData] = useState([
    { pedido: 'PED001', cliente: 'João Silva', dataPrevista: '20/12/2024', statusEntrega: 'Programada', endereco: 'Rua A, 123' },
    { pedido: 'PED002', cliente: 'Empresa ABC', dataPrevista: '18/12/2024', statusEntrega: 'Em Rota', endereco: 'Av. B, 456' },
    { pedido: 'PED003', cliente: 'Maria Santos', dataPrevista: '15/12/2024', statusEntrega: 'Entregue', endereco: 'Rua C, 789' },
  ]);

  const columns = [
    { key: 'pedido', header: 'Pedido' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'dataPrevista', header: 'Data Prevista' },
    { key: 'statusEntrega', header: 'Status Entrega' },
    { key: 'endereco', header: 'Endereço' },
  ];

  return (
    <PageTemplate
      title="Controle de Entregas"
      icon={Truck}
      searchPlaceholder="Pesquisar entregas..."
      addButtonText="NOVA ENTREGA"
      onAddClick={() => console.log('Nova entrega')}
    >
      <DataTable
        columns={columns}
        data={deliveriesData}
        emptyMessage="Nenhuma entrega encontrada"
      />
    </PageTemplate>
  );
};

export default Deliveries;
