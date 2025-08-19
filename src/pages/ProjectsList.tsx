import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Project {
  id: string;
  name: string;
  client: string;
  priority: 'Alta' | 'Baixa' | 'Normal';
  consultant: string;
  createdAt: string;
}

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data similar to the image
  const projects: Project[] = [
    {
      id: '1',
      name: 'Casa Marilandia',
      client: 'Marilandia Vargas',
      priority: 'Alta',
      consultant: 'Consultor Responsável',
      createdAt: '15/08/2025'
    },
    {
      id: '2',
      name: 'Reforma do quarto',
      client: 'Joao Santana',
      priority: 'Baixa',
      consultant: 'Consultor Responsável',
      createdAt: '06/07/2025'
    },
    {
      id: '3',
      name: 'Apartamento',
      client: 'Rafael Tostes',
      priority: 'Alta',
      consultant: 'Consultor Responsável',
      createdAt: '06/07/2025'
    },
    {
      id: '4',
      name: 'HVET',
      client: 'Heitor',
      priority: 'Alta',
      consultant: 'Consultor Responsável',
      createdAt: '06/07/2025'
    },
    {
      id: '5',
      name: 'Modrian',
      client: 'Victor Hugo Pereira Rocha Pereira Rocha',
      priority: 'Baixa',
      consultant: 'Consultor Responsável',
      createdAt: '06/07/2025'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      case 'Baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = (projectId: string) => {
    navigate(`/projetos/${projectId}`);
  };

  const handleNewProject = () => {
    navigate('/projetos/novo');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Sistema /</span>
            <span className="text-gray-800 text-sm">Cadastro de Projetos</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">Projetos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Total de {filteredProjects.length} projetos</span>
            <Button onClick={handleNewProject} className="bg-blue-600 hover:bg-blue-700 text-white">
              Novo Projeto
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            LIMPAR FILTROS
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Exportar</DropdownMenuItem>
              <DropdownMenuItem>Imprimir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Projects Table */}
      <div className="flex-1 bg-white mx-6 mt-6 rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PROJETO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CLIENTE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PRIORIDADE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CONSULTOR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CRIAÇÃO
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                      {project.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {project.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={getPriorityColor(project.priority)}
                    >
                      {project.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {project.consultant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {project.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white mx-6 mb-6 mt-2 px-6 py-4 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Página 1 de 4</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              &lt;
            </Button>
            <Button variant="outline" size="sm">
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;