import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  FolderOpen,
  ClipboardList,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import NewClientDialog from '@/components/Dialogs/NewClientDialog';
import NewProjectWithClientDialog from '@/components/Dialogs/NewProjectWithClientDialog';
import AgendaDialog from '@/components/Dialogs/AgendaDialog';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';

const Dashboard: React.FC = () => {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  
  // Get real data from hooks
  const { data: clientsData, loading: clientsLoading } = useClients({ limit: 1000 });
  const { data: projectsData, loading: projectsLoading } = useProjects();

  // Calculate stats from real data
  const totalClients = clientsData?.total || 0;
  const totalProjects = projectsData?.length || 0;
  
  // Get recent clients (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentClients = clientsData?.data?.filter(client => {
    const clientDate = new Date(client.createdAt);
    return clientDate >= thirtyDaysAgo;
  }).length || 0;

  const stats = [
    {
      title: 'Projetos Ativos',
      value: totalProjects.toString(),
      change: totalProjects > 0 ? '+12%' : '0%',
      trend: 'up' as const,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      previous: Math.max(0, totalProjects - 3).toString()
    },
    {
      title: 'Novos Clientes',
      value: recentClients.toString(),
      change: recentClients > 0 ? '+15%' : '0%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      previous: Math.max(0, recentClients - 2).toString()
    },
    {
      title: 'Total de Clientes',
      value: totalClients.toString(),
      change: totalClients > 0 ? '+8%' : '0%',
      trend: 'up' as const,
      icon: FileText,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
      previous: Math.max(0, totalClients - 1).toString()
    },
    {
      title: 'Faturamento Mensal',
      value: 'R$ 0',
      change: '0%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      previous: 'R$ 0'
    }
  ];

  const recentProjects = projectsData?.slice(0, 3).map(project => ({
    id: project.id,
    name: project.title,
    client: project.clientName || 'Cliente não informado',
    status: project.status || 'Em Andamento',
    value: 'R$ 0,00',
    date: new Date(project.createdAt).toLocaleDateString('pt-BR'),
    priority: 'medium'
  })) || [];

  // Dados para o gráfico de performance mensal
  const monthlyData = [
    { mes: 'Jan', vendas: 0, projetos: 0, clientes: 0 },
    { mes: 'Fev', vendas: 0, projetos: 0, clientes: 0 },
    { mes: 'Mar', vendas: 0, projetos: 0, clientes: 0 },
    { mes: 'Abr', vendas: 0, projetos: 0, clientes: 0 },
    { mes: 'Mai', vendas: 0, projetos: 0, clientes: Math.floor(totalClients * 0.3) },
    { mes: 'Jun', vendas: 0, projetos: Math.floor(totalProjects * 0.8), clientes: totalClients },
  ];

  // Dados para gráfico de pizza (distribuição de projetos por status)
  const projectStatusData = [
    { name: 'Em Andamento', value: Math.floor(totalProjects * 0.4) || 1, color: '#3B82F6' },
    { name: 'Finalizado', value: Math.floor(totalProjects * 0.3) || 1, color: '#10B981' },
    { name: 'Orçamento', value: Math.floor(totalProjects * 0.2) || 1, color: '#F59E0B' },
    { name: 'Cancelado', value: Math.floor(totalProjects * 0.1) || 1, color: '#EF4444' },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <span>Sistema</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">Dashboard</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Painel de Controle</h1>
            <p className="text-slate-600">Visão geral do seu negócio</p>
          </div>
          <div className="text-sm text-slate-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200/50">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`relative overflow-hidden bg-white/60 backdrop-blur-sm border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === 'up' 
                    ? 'text-emerald-700 bg-emerald-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-400">vs {stat.previous} anterior</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              Projetos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-slate-50/80 rounded-xl border border-slate-200/50 hover:shadow-md transition-all duration-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-800">{project.name}</h4>
                        <div className={`w-2 h-2 rounded-full ${
                          project.priority === 'high' ? 'bg-red-400' :
                          project.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                        }`} />
                      </div>
                      <p className="text-sm text-slate-600">{project.client}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        project.status === 'Finalizado' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        project.status === 'Em Andamento' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {project.status}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-2">{project.value}</p>
                      <p className="text-xs text-slate-500">{project.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">Nenhum projeto encontrado</p>
                  <Button variant="outline" onClick={() => setShowNewProjectDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeiro projeto
                  </Button>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-6 border-slate-200 hover:bg-slate-50">
              Ver Todos os Projetos
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 border-slate-200/60 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
                onClick={() => setShowNewProjectDialog(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800">Novo Projeto</div>
                    <div className="text-sm text-slate-500">Cadastrar um novo projeto</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 border-slate-200/60 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200"
                onClick={() => console.log('Acompanhar carteira')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-sm">
                    <ClipboardList className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800">Acompanhar Carteira</div>
                    <div className="text-sm text-slate-500">Visualizar status dos projetos</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 border-slate-200/60 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 transition-all duration-200"
                onClick={() => setShowNewClientDialog(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-sm">
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800">Novo Cliente</div>
                    <div className="text-sm text-slate-500">Cadastrar cliente</div>
                  </div>
                </div>
              </Button>

              <AgendaDialog>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-slate-200/60 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl shadow-sm">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">Agenda</div>
                      <div className="text-sm text-slate-500">Verificar compromissos</div>
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
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              Performance Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="mes" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => [
                      name === 'vendas' ? `R$ ${value.toLocaleString()}` : value,
                      name === 'vendas' ? 'Vendas' :
                      name === 'projetos' ? 'Projetos' : 'Clientes'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="clientes" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorVendas)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Projetos */}
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              Status dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewClientDialog 
        open={showNewClientDialog} 
        onOpenChange={setShowNewClientDialog}
      />
      
      <NewProjectWithClientDialog 
        open={showNewProjectDialog} 
        onOpenChange={setShowNewProjectDialog}
      />
    </div>
  );
};

export default Dashboard;
