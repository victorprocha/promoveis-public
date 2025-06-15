
import React, { useState } from 'react';
import { User } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';

const Specifiers = () => {
  const [specifiersData] = useState([
    { nome: 'Arq. Roberto Lima', contato: '(11) 99999-1234', especialidade: 'Arquitetura Residencial', email: 'roberto@email.com' },
    { nome: 'Eng. Fernanda Costa', contato: '(11) 88888-5678', especialidade: 'Engenharia Civil', email: 'fernanda@email.com' },
    { nome: 'Des. Patricia Silva', contato: '(11) 77777-9012', especialidade: 'Design de Interiores', email: 'patricia@email.com' },
  ]);

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'contato', header: 'Contato' },
    { key: 'especialidade', header: 'Especialidade' },
    { key: 'email', header: 'Email' },
  ];

  return (
    <PageTemplate
      title="Especificadores"
      icon={User}
      searchPlaceholder="Pesquisar especificadores..."
      addButtonText="NOVO ESPECIFICADOR"
      onAddClick={() => console.log('Novo especificador')}
    >
      <DataTable
        columns={columns}
        data={specifiersData}
        emptyMessage="Nenhum especificador encontrado"
      />
    </PageTemplate>
  );
};

export default Specifiers;
