
import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  FolderOpen,
  ClipboardList,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import NewProjectDialog from '@/components/Dialogs/NewProjectDialog';
import NewClientDialog from '@/components/Dialogs/NewClientDialog';
import AgendaDialog from '@/components/Dialogs/AgendaDialog';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Projetos Ativos',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Novos Clientes',
      value: '8',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Orçamentos Pendentes',
      value: '15',
      change: '-8%',
      trend: 'down',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Faturamento Mensal',
      value: 'R$ 45.280',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentProjects = [
    {
      id: '1',
      name: 'Projeto Residencial Silva',
      client: 'João Silva',
      status: 'Em Andamento',
      value: 'R$ 15.280',
      date: '15/01/2024'
    },
    {
      id: '2',
      name: 'Apartamento Moderno Centro',
      client: 'Ana Souza',
      status: 'Orçamento',
      value: 'R$ 8.540',
      date: '12/01/2024'
    },
    {
      id: '3',
      name: 'Casa de Campo Petrópolis',
      client: 'Roberto Oliveira',
      status: 'Finalizado',
      value: 'R$ 32.150',
      date: '10/01/2024'
    }
  ];

  // Dados para o gráfico de performance mensal
  const monthlyData = [
    { mes: 'Jan', vendas: 45000, projetos: 12, clientes: 8 },
    { mes: 'Fev', vendas: 38000, projetos: 15, clientes: 12 },
    { mes: 'Mar', vendas: 52000, projetos: 18, clientes: 15 },
    { mes: 'Abr', vendas: 48000, projetos: 16, clientes: 11 },
    { mes: 'Mai', vendas: 61000, projetos: 22, clientes: 18 },
    { mes: 'Jun', vendas: 55000, projetos: 20, clientes: 14 },
  ];

  // Dados para gráfico de pizza (distribuição de projetos por status)
  const projectStatusData = [
    { name: 'Em Andamento', value: 35, color: '#007BFF' },
    { name: 'Finalizado', value: 28, color: '#28A745' },
    { name: 'Orçamento', value: 20, color: '#FFC107' },
    { name: 'Cancelado', value: 17, color: '#DC3545' },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Sistema</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Dashboard</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
          <div className="text-sm text-gray-500">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 ${
                      stat.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Projetos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Finalizado' ? 'bg-green-100 text-green-800' :
                      project.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {project.status}
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">{project.value}</p>
                    <p className="text-xs text-gray-500">{project.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Projetos
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <NewProjectDialog>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FolderOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Novo Projeto</div>
                      <div className="text-sm text-gray-500">Cadastrar um novo projeto</div>
                    </div>
                  </div>
                </Button>
              </NewProjectDialog>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => console.log('Acompanhar carteira')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Acompanhar Carteira</div>
                    <div className="text-sm text-gray-500">Visualizar status dos projetos</div>
                  </div>
                </div>
              </Button>

              <NewClientDialog>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Novo Cliente</div>
                      <div className="text-sm text-gray-500">Cadastrar cliente</div>
                    </div>
                  </div>
                </Button>
              </NewClientDialog>

              <AgendaDialog>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Agenda</div>
                      <div className="text-sm text-gray-500">Verificar compromissos</div>
                    </div>
                  </div>
                </Button>
              </AgendaDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'vendas' ? `R$ ${value.toLocaleString()}` : value,
                      name === 'vendas' ? 'Vendas' :
                      name === 'projetos' ? 'Projetos' : 'Clientes'
                    ]}
                  />
                  <Bar dataKey="vendas" fill="#007BFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Projetos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Status dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
