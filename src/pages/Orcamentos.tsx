import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, Target, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Mock data for the charts
const billingHistory = [
  { month: '09/2023', value: 80000 },
  { month: '10/2023', value: 55000 },
  { month: '11/2023', value: 260000 }
];

const statusData = [
  { name: 'Ganhos', value: 35, color: '#3b82f6' },
  { name: 'Perdidos', value: 15, color: '#ef4444' },
  { name: 'Pendentes', value: 50, color: '#6b7280' }
];

const tableData = [
  { month: '09/2023', value: 'R$ 78.840,74', evolutionMonth: '0,00%', evolutionYear: '0,00%' },
  { month: '10/2023', value: 'R$ 54.139,57', evolutionMonth: '-31,33%', evolutionYear: '0,00%' },
  { month: '11/2023', value: 'R$ 258.597,88', evolutionMonth: '+377,65%', evolutionYear: '0,00%' }
];

// Additional chart data
const winsLossesData = [
  { month: '09/2023', ganhos: 80000, perdidos: 15000 },
  { month: '10/2023', ganhos: 55000, perdidos: 290000 },
  { month: '11/2023', ganhos: 260000, perdidos: 55000 }
];

const quantityData = [
  { month: '08/2023', total: 32, criados: 32, ganhos: 0, perdidos: 0 },
  { month: '09/2023', total: 23, criados: 23, ganhos: 2, perdidos: 1 },
  { month: '10/2023', total: 30, criados: 30, ganhos: 7, perdidos: 6 },
  { month: '11/2023', total: 13, criados: 13, ganhos: 10, perdidos: 3 }
];

const lossReasonsData = [
  { reason: 'Preço', quantidade: 2 },
  { reason: 'Prazo', quantidade: 4 },
  { reason: 'Produto', quantidade: 2 },
  { reason: 'Outros', quantidade: 2 }
];

const winReasonsData = [
  { reason: 'Qualidade', quantidade: 9 }
];

const salesRankingData = [
  { rank: 1, vendedor: 'Daniel Augusto', faturamento: 'R$ 376.534,74', qtd: 17, ticketMedio: 'R$ 22.149,10' },
  { rank: 2, vendedor: 'Richardson', faturamento: 'R$ 15.043,45', qtd: 2, ticketMedio: 'R$ 7.521,73' }
];

interface OrcamentosProps {}

const Orcamentos = ({}: OrcamentosProps) => {
  const navigate = useNavigate();
  
  const handleNavigateToCreate = () => {
    navigate('/orcamentos/criar');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 rounded-lg border bg-background">
              <option>Todos</option>
            </select>
            <input type="date" className="px-4 py-2 rounded-lg border bg-background" />
            <select className="px-4 py-2 rounded-lg border bg-background">
              <option>3 meses</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleNavigateToCreate}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Criar Orçamento
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Faturados
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            Perdidos
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total de orçamentos</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">83</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Ganhos: 19</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Perdidos: 10</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Pendentes: 54</div>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total em valores</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">R$ 1.696.448,94</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Ganhos: R$ 391.578,19</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Perdidos: R$ 351.858,28</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Pendentes: R$ 953.012,47</div>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tempo ganho</p>
                  <span className="text-2xl font-bold text-foreground">8 dias</span>
                  <p className="text-sm font-medium text-muted-foreground mb-2 mt-4">Tempo perda</p>
                  <span className="text-2xl font-bold text-foreground">12 dias</span>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Ticket médio</p>
                  <span className="text-2xl font-bold text-foreground">R$ 20.609,38</span>
                  <p className="text-sm font-medium text-muted-foreground mb-2 mt-4">Taxa de conversão</p>
                  <span className="text-2xl font-bold text-foreground">34,69%</span>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing History Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Histórico valor total faturado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={billingHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <YAxis 
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wins and Losses Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Orçamentos ganhos e perdidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winsLossesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <YAxis 
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString('pt-BR')}`, 
                        name === 'ganhos' ? 'Ganhos' : 'Perdidos'
                      ]}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="ganhos" fill="#3b82f6" />
                    <Bar dataKey="perdidos" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quantity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quantidade de orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quantityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <YAxis 
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'total' ? 'Total' : name === 'criados' ? 'Criados' : name === 'ganhos' ? 'Ganhos' : 'Perdidos']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="total" fill="#6b7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loss and Win Reasons Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loss Reasons Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Motivos de perda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lossReasonsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis 
                      type="number"
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <YAxis 
                      type="category"
                      dataKey="reason"
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <Tooltip 
                      formatter={(value) => [value, 'Quantidade']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="quantidade" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Win Reasons Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Motivos de ganho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winReasonsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis 
                      dataKey="reason"
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <YAxis 
                      stroke="currentColor" 
                      fontSize={12}
                      opacity={0.7}
                    />
                    <Tooltip 
                      formatter={(value) => [value, 'Quantidade']}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="quantidade" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Dados Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-primary text-primary-foreground">
                      <th className="text-left p-3 font-medium">Mês/Ano</th>
                      <th className="text-left p-3 font-medium">Valor</th>
                      <th className="text-left p-3 font-medium">Evolução mês</th>
                      <th className="text-left p-3 font-medium">Evolução ano</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3">{row.month}</td>
                        <td className="p-3">{row.value}</td>
                        <td className={`p-3 ${row.evolutionMonth.includes('-') ? 'text-red-600' : row.evolutionMonth.includes('+') ? 'text-green-600' : ''}`}>
                          {row.evolutionMonth}
                        </td>
                        <td className="p-3">{row.evolutionYear}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sales Ranking Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Ranking de Vendedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-primary text-primary-foreground">
                      <th className="text-left p-3 font-medium">Rank</th>
                      <th className="text-left p-3 font-medium">Vendedor</th>
                      <th className="text-left p-3 font-medium">Faturamento</th>
                      <th className="text-left p-3 font-medium">Qtd</th>
                      <th className="text-left p-3 font-medium">Ticket médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesRankingData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{row.rank}</td>
                        <td className="p-3">{row.vendedor}</td>
                        <td className="p-3 font-medium text-green-600">{row.faturamento}</td>
                        <td className="p-3">{row.qtd}</td>
                        <td className="p-3">{row.ticketMedio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Orcamentos;