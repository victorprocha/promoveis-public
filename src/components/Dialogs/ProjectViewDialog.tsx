
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Phone, Mail, MapPin } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  value: string;
  startDate: string;
  description?: string;
  priority?: string;
  consultant?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ProjectViewDialogProps {
  project: Project;
  children: React.ReactNode;
}

const ProjectViewDialog: React.FC<ProjectViewDialogProps> = ({ project, children }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
      case 'em andamento':
        return 'bg-green-100 text-green-800';
      case 'pendente':
      case 'orçamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'finalizado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Projeto
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informações Básicas</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome do Projeto</label>
                  <p className="text-gray-900">{project.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cliente</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {project.client}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valor</label>
                  <p className="text-gray-900 font-semibold text-lg">{project.value}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Início</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {project.startDate}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informações de Contato</h3>
              <div className="space-y-3">
                {project.consultant && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Consultor</label>
                    <p className="text-gray-900">{project.consultant}</p>
                  </div>
                )}
                {project.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {project.phone}
                    </p>
                  </div>
                )}
                {project.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">E-mail</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {project.email}
                    </p>
                  </div>
                )}
                {project.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Endereço</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {project.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {project.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{project.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewDialog;
