import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Edit, Upload, Plus, Receipt, Calendar, Users, Paperclip, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProjectDetailsProps {
  projectId?: string;
  onBack?: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onBack }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dados-projeto');
  
  const id = projectId || params.id;

  // Mock project data
  const project = {
    id: id,
    name: 'Projeto Cozinha Maria Silva',
    client: {
      name: 'Maria Silva',
      phone: '(11) 99999-9999',
      email: 'maria.silva@email.com'
    },
    consultant: 'Maria Oliveira',
    executor: 'Carlos Santos',
    designer: 'Ana Costa',
    specifier: 'Roberto Lima',
    enterprise: 'Residencial Gardens',
    deadline: '30/06/2024',
    deliveryAddress: 'Rua das Flores, 123 - São Paulo, SP',
    observations: 'Cliente prefere tons neutros'
  };

  const navigationItems = [
    { id: 'dados-projeto', label: 'Dados do Projeto', icon: Edit },
    { id: 'ambientes', label: 'Ambientes', icon: Edit },
    { id: 'itens-avulsos', label: 'Itens Avulsos', icon: Receipt },
    { id: 'orcamentos', label: 'Orçamentos', icon: Receipt },
    { id: 'contratos', label: 'Contratos', icon: Receipt },
    { id: 'pedidos-compra', label: 'Pedidos de Compra', icon: Receipt },
    { id: 'assistencias', label: 'Assistências Técnicas', icon: Users },
    { id: 'agendas', label: 'Agendas do Projeto', icon: Calendar },
    { id: 'envolvidos', label: 'Envolvidos', icon: Users },
    { id: 'anexos', label: 'Anexos', icon: Paperclip },
    { id: 'concorrentes', label: 'Concorrentes', icon: TrendingUp }
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id);
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#ECF0F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Cadastro de Projetos</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {id} - {project.name} - {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Main Content - Left Column */}
        <div className="flex-1 p-6 pr-3">
          <div className="space-y-6">
            {/* Client Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{project.client.name}</h3>
                      <p className="text-gray-600">{project.client.phone}</p>
                      <p className="text-gray-600">{project.client.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Data Section */}
            <section id="dados-projeto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Dados do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.name}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultor Responsável</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.consultant}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultor Executor</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.executor}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Projetista</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.designer}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Especificador</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.specifier}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Empreendimento</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.enterprise}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prazo da Obra</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.deadline}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                      <div className="p-3 bg-gray-50 rounded-md">{project.deliveryAddress}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <div className="p-3 bg-gray-50 rounded-md">{project.observations}</div>
                  </div>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Importar Arquivo do Projeto</p>
                    <p className="text-sm text-gray-500">Arraste o arquivo ou clique para selecionar</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Environments Section */}
            <section id="ambientes">
              <Card>
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Ambientes
                    </CardTitle>
                    <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Ambiente</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Última alteração em</TableHead>
                        <TableHead>Valor Bruto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Nenhum registro encontrado
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="p-4 bg-green-50 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">TOTAL DOS AMBIENTES</span>
                      <span className="text-green-600 font-bold text-lg">R$ 0,00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Other sections with similar structure */}
            {navigationItems.slice(2).map((item) => (
              <section key={item.id} id={item.id}>
                <Card>
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </CardTitle>
                      <Button size="icon" className="bg-green-600 hover:bg-green-700 rounded-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>
        </div>

        {/* Right Navigation Column */}
        <div className="w-64 p-6 pl-3">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Navegação</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              VOLTAR
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <button className="text-blue-600 hover:underline">TROCAR CLIENTE</button>
              <span className="text-gray-400">|</span>
              <button className="text-blue-600 hover:underline">HISTÓRICO</button>
              <span className="text-gray-400">|</span>
              <button className="text-blue-600 hover:underline">CANCELAR PROJETO</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive">
              EXCLUIR
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              EDITAR
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom spacing to avoid fixed bar overlap */}
      <div className="h-20"></div>
    </div>
  );
};

export default ProjectDetails;
