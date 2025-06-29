
import React, { useState } from 'react';
import { User, Edit, Eye, Trash2 } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import DataTable from '@/components/Common/DataTable';
import NewSpecifierDialog from '@/components/Dialogs/NewSpecifierDialog';

interface Specifier {
  nome: string;
  contato: string;
  especialidade: string;
  email: string;
}

const Specifiers = () => {
  const [specifiersData, setSpecifiersData] = useState<Specifier[]>([
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

  const handleAddSpecifier = (newSpecifier: Specifier) => {
    setSpecifiersData(prev => [newSpecifier, ...prev]);
  };

  const handleEdit = (specifier: Specifier) => {
    console.log('Editar especificador:', specifier);
  };

  const handleView = (specifier: Specifier) => {
    console.log('Visualizar especificador:', specifier);
  };

  const handleDelete = (specifier: Specifier) => {
    if (window.confirm(`Tem certeza que deseja excluir o especificador "${specifier.nome}"?`)) {
      setSpecifiersData(prev => prev.filter(s => s.email !== specifier.email));
    }
  };

  return (
    <PageTemplate
      title="Especificadores"
      icon={User}
      searchPlaceholder="Pesquisar especificadores..."
      addButtonText="NOVO ESPECIFICADOR"
      onAddClick={() => {}}
      customAddButton={
        <NewSpecifierDialog onAdd={handleAddSpecifier}>
          <button className="bg-[#28A745] hover:bg-[#218838] text-white font-medium px-4 py-2 rounded-md">
            NOVO ESPECIFICADOR
          </button>
        </NewSpecifierDialog>
      }
    >
      <DataTable
        columns={columns}
        data={specifiersData}
        emptyMessage="Nenhum especificador encontrado"
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </PageTemplate>
  );
};

export default Specifiers;
