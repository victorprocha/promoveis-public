
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Package } from 'lucide-react';

const Dashboard = () => {
  // Sample data for charts
  const monthlyPerformanceData = [
    { month: 'Jan', vendas: 45, projetos: 12, entregas: 8 },
    { month: 'Fev', vendas: 52, projetos: 15, entregas: 10 },
    { month: 'Mar', vendas: 48, projetos: 18, entregas: 12 },
    { month: 'Abr', vendas: 61, projetos: 22, entregas: 15 },
    { month: 'Mai', vendas: 55, projetos: 20, entregas: 18 },
    { month: 'Jun', vendas: 67, projetos: 25, entregas: 20 },
  ];

  const salesByCategory = [
    { name: 'Móveis Planejados', value: 35, color: '#007BFF' },
    { name: 'Decoração', value: 25, color: '#28A745' },
    { name: 'Iluminação', value: 20, color: '#FFC107' },
    { name: 'Acessórios', value: 20, color: '#DC3545' },
  ];

  const recentProjects = [
    { name: 'Projeto Residencial Silva', status: 'Em Andamento', progress: 75 },
    { name: 'Escritório Comercial ABC', status: 'Finalizado', progress: 100 },
    { name: 'Apartamento Jardins', status: 'Planejamento', progress: 25 },
    { name: 'Casa Condomínio XYZ', status: 'Em Andamento', progress: 60 },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-[#2A3F54]">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Visão geral do sistema</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#007BFF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-green-600">+12% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <Package className="h-4 w-4 text-[#28A745]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-green-600">+8% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-[#FFC107]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-green-600">+5% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#DC3545]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20</div>
              <p className="text-xs text-green-600">+15% em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Mensal</CardTitle>
              <CardDescription>Vendas, projetos e entregas por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="vendas" stroke="#007BFF" strokeWidth={2} />
                  <Line type="monotone" dataKey="projetos" stroke="#28A745" strokeWidth={2} />
                  <Line type="monotone" dataKey="entregas" stroke="#FFC107" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vendas por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
              <CardDescription>Distribuição das vendas por tipo de produto</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {salesByCategory.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
            <CardDescription>Últimos projetos em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <p className="text-xs text-gray-600">{project.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#007BFF] h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
