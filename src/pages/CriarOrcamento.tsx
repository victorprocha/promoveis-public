import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ChevronDown, Plus, ArrowLeft } from 'lucide-react';
import { useClients } from '@/hooks/useClients';

interface CriarOrcamentoProps {
  onNavigate?: (module: string) => void;
}

const CriarOrcamento = ({ onNavigate }: CriarOrcamentoProps) => {
  const [activeTab, setActiveTab] = useState('dados');
  const [showEnvironmentDropdown, setShowEnvironmentDropdown] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [customEnvironment, setCustomEnvironment] = useState('');
  const [environmentDescription, setEnvironmentDescription] = useState('');
  
  const { data: clientsData, loading: clientsLoading } = useClients();
  
  // Filter clients based on search
  const filteredClients = clientsData?.data?.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearch.toLowerCase())
  ) || [];

  const handleBackNavigation = () => {
    if (onNavigate) {
      onNavigate('orcamentos');
    } else {
      // Fallback for direct access
      window.history.back();
    }
  };

  const environments = [
    'Ambiente manual',
    'Ambiente Promob',
    'Ambiente Dinabox', 
    'Ambiente Upmobb',
    'Ambiente Freire',
    'Ambiente WPS',
    'Serviços',
    'Itens adicionais'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackNavigation}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Orçamento: 668</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dados">Dados do orçamento</TabsTrigger>
            <TabsTrigger value="precificacao">Precificação</TabsTrigger>
            <TabsTrigger value="anotacoes">Anotações</TabsTrigger>
            <TabsTrigger value="comissoes">Comissões</TabsTrigger>
            <TabsTrigger value="anexos">Anexos</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2 relative">
                    <Label htmlFor="cliente">Cliente*</Label>
                    <Input
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        setShowClientDropdown(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowClientDropdown(clientSearch.length > 0)}
                      onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                      placeholder="Digite o nome do cliente..."
                      className="w-full"
                    />
                    
                    {showClientDropdown && filteredClients.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {filteredClients.slice(0, 5).map((client) => (
                          <button
                            key={client.id}
                            className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-b last:border-b-0 focus:bg-muted focus:outline-none"
                            onClick={() => {
                              setClientSearch(`${client.name} | ${client.phone || client.email || ''}`);
                              setShowClientDropdown(false);
                            }}
                          >
                            <div className="font-medium">{client.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {client.phone && `Tel: ${client.phone}`}
                              {client.phone && client.email && ' | '}
                              {client.email && `Email: ${client.email}`}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendedor">Vendedor*</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Daniel Augusto Bezerra Corrêa | Telefone: (84) 99830-2597" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendedor1">Daniel Augusto Bezerra Corrêa | Telefone: (84) 99830-2597</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arquiteto">Arquiteto</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arquiteto1">Arquiteto 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="data-inicial">Data inicial*</Label>
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status*</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pendente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data-entrega">Data entrega*</Label>
                    <Input type="date" defaultValue="2025-08-12" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dias-montagem">Dias úteis montagem</Label>
                    <Input type="number" defaultValue="7" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="garantia">Garantia*</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="9 anos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9anos">9 anos</SelectItem>
                        <SelectItem value="5anos">5 anos</SelectItem>
                        <SelectItem value="3anos">3 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="ambiente">Ambiente</Label>
                    <Input
                      value={customEnvironment}
                      onChange={(e) => setCustomEnvironment(e.target.value)}
                      placeholder="Digite o nome do ambiente..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Adicione ambiente/serviço</Label>
                  <div className="relative">
                    <Button 
                      onClick={() => setShowEnvironmentDropdown(!showEnvironmentDropdown)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Adicionar <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    
                    {showEnvironmentDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-lg shadow-lg z-10">
                        {environments.map((env, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-2 hover:bg-muted text-sm border-b last:border-b-0"
                            onClick={() => {
                              console.log(`Selected: ${env}`);
                              setShowEnvironmentDropdown(false);
                            }}
                          >
                            {env}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <Label>Descrição do Ambiente</Label>
                    <RichTextEditor
                      value={environmentDescription}
                      onChange={setEnvironmentDescription}
                      placeholder="Digite a descrição do ambiente..."
                      className="min-h-32"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Considerações finais</Label>
                    <Textarea 
                      className="min-h-32 resize-none"
                      defaultValue="[garantia] de garantia para produtos fornecidos e fabricados pela contratada.
Toda ferragem usada na fabricação e montagem é de primeira linha.
Prazo de entrega: [dias_uteis_entrega] dias úteis após assinatura do projeto final.
Validade do orçamento: 7 dias úteis."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Proposals Section */}
            <Card>
              <CardHeader>
                <CardTitle>Propostas de pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-8 text-sm">
                    <span>Ambientes: <strong>R$ 0,00</strong></span>
                    <span>Serviços: <strong>R$ 0,00</strong></span>
                    <span>Adicionais: <strong>R$ 0,00</strong></span>
                    <span>Total: <strong>R$ 0,00</strong></span>
                  </div>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">Nenhuma proposta de pagamento cadastrada</p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar proposta
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Adicione ambientes, serviços ou itens adicionais ao orçamento antes de configurar as condições de pagamento.
                </p>
              </CardContent>
            </Card>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label>Visualizar documentos</Label>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doc1">Documento 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Visualizar contratos</Label>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contrato1">Contrato 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600">
                  ✓ Salvar
                </Button>
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  📄 Faturar
                </Button>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  ❌ Perder
                </Button>
                <Button variant="outline" onClick={handleBackNavigation}>
                  ← Voltar
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="precificacao">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Conteúdo da aba Precificação</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anotacoes">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Conteúdo da aba Anotações</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comissoes">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Conteúdo da aba Comissões</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anexos">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Conteúdo da aba Anexos</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CriarOrcamento;