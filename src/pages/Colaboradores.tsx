import React, { useState } from 'react';
import { Users, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PageTemplate from '@/components/Layout/PageTemplate';

interface Colaborador {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  usuario: string;
  situacao: 'Ativo' | 'Inativo';
}

interface ColaboradoresProps {
  onNewColaborador?: () => void;
}

const Colaboradores: React.FC<ColaboradoresProps> = ({ onNewColaborador }) => {
  const [colaboradores] = useState<Colaborador[]>([
    {
      id: '1',
      nome: 'Bruno Wyatt Gomes',
      cargo: 'DIRETOR',
      telefone: 'Não informado',
      email: 'Não informado',
      usuario: 'Bruno Wyatt Gomes',
      situacao: 'Ativo'
    },
    {
      id: '2',
      nome: 'CONSULTOR DE IMPLANTAÇÃO',
      cargo: 'DIRETOR',
      telefone: 'Não informado',
      email: 'Não informado',
      usuario: 'Gustavo Oliveira',
      situacao: 'Ativo'
    },
    {
      id: '3',
      nome: 'Ed Carlos',
      cargo: 'MONTADOR',
      telefone: 'Não informado',
      email: 'Não informado',
      usuario: 'Não informado',
      situacao: 'Ativo'
    },
    {
      id: '4',
      nome: 'Enzo Vargas Santos',
      cargo: 'CONSULTOR DE VENDAS',
      telefone: 'Não informado',
      email: 'vargasenzo000@gmail.com',
      usuario: 'Enzo Vargas Santos',
      situacao: 'Ativo'
    },
    {
      id: '5',
      nome: 'Leticia Gonçalves Cordeiro',
      cargo: 'CONSULTOR DE VENDAS',
      telefone: 'Não informado',
      email: 'store.leticiag@gmail.com',
      usuario: 'Leticia Gonçalves Cordeiro',
      situacao: 'Ativo'
    },
    {
      id: '6',
      nome: 'Luis Carlos Souza',
      cargo: 'DIRETOR',
      telefone: 'Não informado',
      email: 'luisdifratelli@gmail.com',
      usuario: 'Luis Carlos Souza',
      situacao: 'Ativo'
    },
    {
      id: '7',
      nome: 'Marilandia Vargas',
      cargo: 'DIRETOR',
      telefone: 'Não informado',
      email: 'marilandia.store@gmail.com',
      usuario: 'Marilandia Vargas',
      situacao: 'Ativo'
    }
  ]);

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
              {colaboradores.map((colaborador) => (
                <TableRow key={colaborador.id} className="hover:bg-slate-50/50 cursor-pointer">
                  <TableCell>
                    <span className="text-blue-600 hover:underline font-medium">
                      {colaborador.nome}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{colaborador.cargo}</TableCell>
                  <TableCell className="text-slate-500">{colaborador.telefone}</TableCell>
                  <TableCell className="text-slate-500">{colaborador.email}</TableCell>
                  <TableCell>{colaborador.usuario}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={colaborador.situacao === 'Ativo' ? 'default' : 'secondary'}
                      className={colaborador.situacao === 'Ativo' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    >
                      {colaborador.situacao}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
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