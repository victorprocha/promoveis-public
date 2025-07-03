import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Plus, Calendar, Edit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ClientDetailsProps {
  clientId?: string;
  onBack?: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ clientId, onBack }) => {
  const [client] = useState({
    id: '1',
    name: 'ANDRÉA PACHECO TERRA',
    gender: 'Masculino',
    age: '0 ano(s)',
    phone: '(22) 98126-1888',
    email: 'andreaterra012@gmail.com',
    address: 'Não Informado',
    cpf: 'Não Informado',
    rg: 'Não Informado'
  });

  const [projects] = useState([
    {
      id: '6',
      name: 'ANDRÉA PACHECO TERRA - 25/02/25',
      budget: 'Orçamento Automático 1',
      salesType: 'Normal',
      number: 'Não Informado',
      createdAt: '25/02/2025',
      status: 'Incluído',
      value: 'R$ 108.707,00'
    }
  ]);

  const [salesHistory] = useState({
    budgets: 1,
    sales: 0,
    totalValue: 'R$0,00'
  });

  const [phones] = useState([
    {
      type: 'Celular (Principal)',
      number: '(22) 98126-1888'
    }
  ]);

  const [agendas] = useState([
    {
      type: 'REAPRESENTAÇÃO',
      date: '10/05/2025 - 15:00',
      client: 'ANDRÉA PACHECO TERRA'
    }
  ]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ECF0F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="text-sm text-gray-500">
          Clientes &gt; Ficha do Cliente
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Column - Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Client Header */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#007BFF] rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#2A3F54] mb-1">{client.name}</h1>
                    <div className="text-sm text-gray-600">
                      {client.gender}, {client.age}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {client.email}
                      </div>
                    </div>
                  </div>
                  <Button size="icon" variant="outline" className="text-[#007BFF] border-[#007BFF]">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Data */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg text-[#2A3F54]">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Endereço</label>
                    <p className="text-gray-900">{client.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CPF</label>
                    <p className="text-gray-900">{client.cpf}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">RG</label>
                    <p className="text-gray-900">{client.rg}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-[#007BFF]" />
                    <CardTitle className="text-lg text-[#2A3F54]">
                      Projetos de {client.name}
                    </CardTitle>
                  </div>
                  <Button size="icon" className="bg-[#28A745] hover:bg-[#218838] rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Projeto</TableHead>
                      <TableHead>Orçamento</TableHead>
                      <TableHead>Tipo de Venda</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-gray-50">
                        <TableCell>
                          <button className="text-[#007BFF] hover:underline font-medium">
                            {project.name}
                          </button>
                        </TableCell>
                        <TableCell className="text-gray-600">{project.budget}</TableCell>
                        <TableCell className="text-gray-600">{project.salesType}</TableCell>
                        <TableCell className="text-gray-600">{project.number}</TableCell>
                        <TableCell className="text-gray-600">{project.createdAt}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{project.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-6 py-4 text-sm text-gray-500">
                  Linhas por página: 30 ▼ &nbsp;&nbsp;&nbsp; 1-1 de 1
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Info Cards */}
        <div className="w-80 p-6 space-y-4">
          {/* Sales History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-1">
                HISTÓRICO DE VENDAS
                <div className="w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center">
                  ?
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div className="text-xs text-gray-600">ORÇAMENTOS</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                  <div className="text-xs text-gray-600">VENDAS</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t">
                <div className="text-2xl font-bold text-pink-500">{salesHistory.totalValue}</div>
                <div className="text-xs text-gray-600">TOTAL VENDIDO</div>
              </div>
            </CardContent>
          </Card>

          {/* Phones */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-pink-500" />
                  Telefones
                </CardTitle>
                <Button size="icon" className="bg-pink-500 hover:bg-pink-600 rounded-full w-6 h-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {phones.map((phone, index) => (
                <div key={index} className="mb-2">
                  <div className="text-xs text-gray-500">{phone.type}</div>
                  <div className="text-sm text-[#007BFF] font-medium">{phone.number}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Client Agenda */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">Agenda do Cliente</CardTitle>
                <Button size="icon" className="bg-purple-500 hover:bg-purple-600 rounded-full w-6 h-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {agendas.map((agenda, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded mb-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-red-600">{agenda.type}</div>
                    <div className="text-xs text-gray-600">{agenda.date}</div>
                    <div className="text-xs text-gray-600">{agenda.client}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
              <div className="text-center pt-2">
                <Button variant="link" className="text-[#007BFF] text-xs">
                  VER TODAS AGENDAS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Client Attachments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">📎</span>
                  </div>
                  Anexos do Cliente
                </CardTitle>
                <Button size="icon" className="bg-gray-500 hover:bg-gray-600 rounded-full w-6 h-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR
        </Button>
        
        <div className="flex items-center gap-4">
          <Button variant="link" className="text-[#007BFF]">VER FICHA COMPLETA</Button>
          <Button variant="outline" className="text-red-600 border-red-600">EXCLUIR</Button>
          <Button className="bg-[#007BFF] hover:bg-[#0056b3]">EDITAR</Button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;