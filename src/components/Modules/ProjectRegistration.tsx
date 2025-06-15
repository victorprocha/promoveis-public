
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  client: string;
  consultant: string;
  specifier: string;
  environments: number;
  budgets: number;
  status: 'active' | 'pending' | 'completed';
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Projeto Residencial Silva',
    createdAt: '2024-01-15',
    client: 'João Silva',
    consultant: 'Enzo Vargas Santos',
    specifier: 'Maria Costa',
    environments: 5,
    budgets: 3,
    status: 'active'
  },
  {
    id: '2',
    name: 'Apartamento Moderno Centro',
    createdAt: '2024-01-12',
    client: 'Ana Souza',
    consultant: 'Carlos Lima',
    specifier: 'Pedro Santos',
    environments: 3,
    budgets: 2,
    status: 'pending'
  },
  {
    id: '3',
    name: 'Casa de Campo Petrópolis',
    createdAt: '2024-01-10',
    client: 'Roberto Oliveira',
    consultant: 'Enzo Vargas Santos',
    specifier: 'Lucia Ferreira',
    environments: 8,
    budgets: 5,
    status: 'completed'
  },
  {
    id: '4',
    name: 'Escritório Empresarial',
    createdAt: '2024-01-08',
    client: 'Tech Solutions Ltda',
    consultant: 'Mariana Rosa',
    specifier: 'João Pedro',
    environments: 4,
    budgets: 2,
    status: 'active'
  },
  {
    id: '5',
    name: 'Loft Industrial São Paulo',
    createdAt: '2024-01-05',
    client: 'Design Studio',
    consultant: 'Carlos Lima',
    specifier: 'Ana Maria',
    environments: 2,
    budgets: 3,
    status: 'pending'
  },
];

const ProjectRegistration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.consultant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(currentProjects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects(prev => [...prev, projectId]);
    } else {
      setSelectedProjects(prev => prev.filter(id => id !== projectId));
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const },
      pending: { label: 'Pendente', variant: 'secondary' as const },
      completed: { label: 'Concluído', variant: 'destructive' as const },
    };
    
    return statusConfig[status];
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Sistema</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Cadastro de Projetos</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Cadastro de Projetos</h1>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-white rounded-lg border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar projetos, clientes, consultores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            LIMPAR FILTROS
          </Button>
          
          <Button className="bg-[#28A745] hover:bg-[#218838] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4 text-[#FFC107]" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Exportar para Excel</DropdownMenuItem>
              <DropdownMenuItem>Exportar para PDF</DropdownMenuItem>
              <DropdownMenuItem>Configurar Colunas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProjects.length === currentProjects.length && currentProjects.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold">Projeto</TableHead>
              <TableHead className="font-semibold">Data de Criação</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Consultor</TableHead>
              <TableHead className="font-semibold">Especificador</TableHead>
              <TableHead className="font-semibold text-center">Ambientes</TableHead>
              <TableHead className="font-semibold text-center">Orçamentos</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProjects.map((project) => {
              const statusConfig = getStatusBadge(project.status);
              return (
                <TableRow key={project.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <a href="#" className="text-[#007BFF] hover:underline font-medium">
                      {project.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-gray-900">{project.client}</TableCell>
                  <TableCell className="text-gray-900">{project.consultant}</TableCell>
                  <TableCell className="text-gray-900">{project.specifier}</TableCell>
                  <TableCell className="text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {project.environments}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      {project.budgets}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-500">
            Mostrando {startIndex + 1} até {Math.min(endIndex, filteredProjects.length)} de {filteredProjects.length} resultados
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[32px]"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRegistration;
