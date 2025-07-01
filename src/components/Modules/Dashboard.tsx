import React, { useState } from 'react';
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
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import NewProjectDialog from '@/components/Dialogs/NewProjectDialog';
import NewClientDialog from '@/components/Dialogs/NewClientDialog';
import AgendaDialog from '@/components/Dialogs/AgendaDialog';

const Dashboard: React.FC = () => {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  
  const stats = [
    {
      title: 'Projetos Ativos',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      previous: '21'
    },
    {
      title: 'Novos Clientes',
      value: '8',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      previous: '7'
    },
    {
      title: 'Orçamentos Pendentes',
      value: '15',
      change: '-8%',
      trend: 'down',
      icon: FileText,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
      previous: '16'
    },
    {
      title: 'Faturamento Mensal',
      value: 'R$ 45.280',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      previous: 'R$ 38.373'
    }
  ];

  const recentProjects = [
    {
      id: '1',
      name: 'Projeto Residencial Silva',
      client: 'João Silva',
      status: 'Em Andamento',
      value: 'R$ 15.280',
      date: '15/01/2024',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Apartamento Moderno Centro',
      client: 'Ana Souza',
      status: 'Orçamento',
      value: 'R$ 8.540',
      date: '12/01/2024',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Casa de Campo Petrópolis',
      client: 'Roberto Oliveira',
      status: 'Finalizado',
      value: 'R$ 32.150',
      date: '10/01/2024',
      priority: 'low'
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
    { name: 'Em Andamento', value: 35, color: '#3B82F6' },
    { name: 'Finalizado', value: 28, color: '#10B981' },
    { name: 'Orçamento', value: 20, color: '#F59E0B' },
    { name: 'Cancelado', value: 17, color: '#EF4444' },
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
              {recentProjects.map((project) => (
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
              ))}
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
              <NewProjectDialog>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-slate-200/60 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
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
              </NewProjectDialog>

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
                    dataKey="vendas" 
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
    </div>
  );
};

export default Dashboard;
