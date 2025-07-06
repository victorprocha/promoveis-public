
import React from 'react';
import { User } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import InteractiveDataTable from '@/components/Common/InteractiveDataTable';
import NewSpecifierDialog from '@/components/Dialogs/NewSpecifierDialog';
import EditSpecifierDialog from '@/components/Dialogs/EditSpecifierDialog';
import { useSpecifiers } from '@/hooks/useSpecifiers';
import { useToast } from '@/hooks/use-toast';

const Specifiers = () => {
  const { specifiers, loading, addSpecifier, updateSpecifier, deleteSpecifier } = useSpecifiers();
  const { toast } = useToast();

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'contato', header: 'Contato' },
    { key: 'especialidade', header: 'Especialidade' },
    { key: 'email', header: 'Email' },
  ];

  const handleAddSpecifier = async (newSpecifier: any) => {
    await addSpecifier(newSpecifier);
  };

  const handleEdit = (specifier: any) => {
    // This will be handled by the EditSpecifierDialog component
  };

  const handleView = (specifier: any) => {
    console.log('Visualizar especificador:', specifier);
    // TODO: Implementar funcionalidade de visualização
  };

  const handleDelete = async (specifier: any) => {
    if (window.confirm(`Tem certeza que deseja excluir o especificador "${specifier.nome}"?`)) {
      try {
        await deleteSpecifier(specifier.id);
        toast({
          title: "Especificador excluído",
          description: "O especificador foi excluído com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir especificador. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateSpecifier = async (id: string, data: any) => {
    await updateSpecifier(id, data);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-100/40">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Carregando especificadores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-100/40">
      <PageTemplate
        title="Especificadores"
        icon={User}
        searchPlaceholder="Pesquisar especificadores..."
        addButtonText="NOVO ESPECIFICADOR"
        onAddClick={() => {}}
        customAddButton={
          <NewSpecifierDialog onAdd={handleAddSpecifier}>
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              NOVO ESPECIFICADOR
            </button>
          </NewSpecifierDialog>
        }
      >
        <InteractiveDataTable
          columns={columns}
          data={specifiers}
          emptyMessage="Nenhum especificador encontrado"
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          customActions={(item) => (
            <EditSpecifierDialog 
              specifier={item} 
              onUpdate={handleUpdateSpecifier}
            />
          )}
        />
      </PageTemplate>
    </div>
  );
};

export default Specifiers;
