
import React, { useState } from 'react';
import { User, Users, Award, Mail, Phone } from 'lucide-react';
import PageTemplate from '@/components/Layout/PageTemplate';
import InteractiveDataTable from '@/components/Common/InteractiveDataTable';
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
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-100/40">
      {/* Statistics Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Especificadores</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{specifiersData.length}</p>
                <p className="text-xs text-blue-600 mt-1">Profissionais cadastrados</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Arquitetos</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-emerald-600 mt-1">Especialistas em arquitetura</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Engenheiros</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-amber-600 mt-1">Especialistas em engenharia</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Designers</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">1</p>
                <p className="text-xs text-purple-600 mt-1">Especialistas em design</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

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
          data={specifiersData}
          emptyMessage="Nenhum especificador encontrado"
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </PageTemplate>
    </div>
  );
};

export default Specifiers;
