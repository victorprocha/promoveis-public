
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import NewProjectDialog from '@/components/Dialogs/NewProjectDialog';
import FilterDialog from '@/components/Dialogs/FilterDialog';
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectRegistrationProps {
  onNewProject?: () => void;
  onViewProject?: (projectId: string) => void;
}

const ProjectRegistration: React.FC<ProjectRegistrationProps> = ({ onNewProject, onViewProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  const { data: projects, loading, error, refetch } = useProjects();

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const isAllSelected = currentProjects.every((project) =>
    selectedProjects.includes(project.id)
  );

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProjects(
        selectedProjects.filter((id) => !currentProjects.map((p) => p.id).includes(id))
      );
    } else {
      const newSelected = [...selectedProjects];
      currentProjects.forEach((project) => {
        if (!newSelected.includes(project.id)) {
          newSelected.push(project.id);
        }
      });
      setSelectedProjects(newSelected);
    }
  };

  const handleNewProjectClick = () => {
    if (onNewProject) {
      onNewProject();
    }
  };

  const handleProjectClick = (projectId: string) => {
    if (onViewProject) {
      onViewProject(projectId);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProjects([]);
    setCurrentPage(1);
  };

  const handleProjectCreated = () => {
    refetch(); // Refresh the projects list
  };

  // Loading state
  if (loading === 'loading') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Sistema</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Cadastro de Projetos</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-red-600 mb-4">Erro ao carregar projetos: {error}</p>
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Sistema</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Cadastro de Projetos</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <div className="text-sm text-gray-500">
            Total de {filteredProjects.length} projetos
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleClearFilters}>
              LIMPAR FILTROS
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              className="bg-[#28A745] hover:bg-[#218838] text-white"
              onClick={handleNewProjectClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
            
            <FilterDialog>
              <Button variant="outline" size="icon" className="text-[#FFC107] border-[#FFC107] hover:bg-[#FFC107] hover:text-white">
                <Filter className="h-4 w-4" />
              </Button>
            </FilterDialog>
            
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projeto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consultor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criação
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProjects.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'Nenhum projeto encontrado para sua pesquisa.' : 'Nenhum projeto encontrado. Crie seu primeiro projeto!'}
                </td>
              </tr>
            ) : (
              currentProjects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleSelectProject(project.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      {project.title}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{project.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.priority}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{project.consultant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleProjectClick(project.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRegistration;
