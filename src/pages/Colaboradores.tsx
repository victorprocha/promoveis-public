import React from 'react';
import { Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageTemplate from '@/components/Layout/PageTemplate';
import { useCollaborators } from '@/hooks/useCollaborators';

interface ColaboradoresProps {
  onNewColaborador?: () => void;
}

const Colaboradores: React.FC<ColaboradoresProps> = ({ onNewColaborador }) => {
  const { collaborators, loading } = useCollaborators();

  return (
    <PageTemplate
      title="Colaboradores"
      icon={Users}
      searchPlaceholder="Pesquisar colaboradores..."
      addButtonText="NOVO COLABORADOR"
      onAddClick={onNewColaborador}
    >
      <div className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Carregando colaboradores...
                  </TableCell>
                </TableRow>
              ) : collaborators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum colaborador encontrado
                  </TableCell>
                </TableRow>
              ) : (
                collaborators.map((colaborador) => (
                  <TableRow key={colaborador.id} className="hover:bg-slate-50/50 cursor-pointer">
                    <TableCell>
                      <span className="text-blue-600 hover:underline font-medium">
                        {colaborador.name}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{colaborador.role || 'Não informado'}</TableCell>
                    <TableCell className="text-slate-500">{colaborador.phone || 'Não informado'}</TableCell>
                    <TableCell className="text-slate-500">{colaborador.email || 'Não informado'}</TableCell>
                    <TableCell>{colaborador.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Ativo
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500">
            Linhas por página: 
            <select className="ml-2 border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              ‹
            </Button>
            <Button variant="outline" size="sm" disabled>
              ›
            </Button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Colaboradores;