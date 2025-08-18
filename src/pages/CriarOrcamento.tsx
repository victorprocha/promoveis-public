import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ChevronDown, Plus, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useBudgets, useBudgetEnvironments } from '@/hooks/useBudgets';
import { toast } from 'sonner';

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
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [currentBudget, setCurrentBudget] = useState<any>(null);
  const [initialDate, setInitialDate] = useState(new Date().toISOString().split('T')[0]);
  const [budgetObservations, setBudgetObservations] = useState('');
  const [finalConsiderations, setFinalConsiderations] = useState('[garantia] de garantia para produtos fornecidos e fabricados pela contratada.\nToda ferragem usada na fabricação e montagem é de primeira linha.\nPrazo de entrega: [dias_uteis_entrega] dias úteis após assinatura do projeto final.\nValidade do orçamento: 7 dias úteis.');
  
  const { data: clientsData, loading: clientsLoading } = useClients();
  const { createBudget } = useBudgets();
  const { environments, addEnvironment, updateEnvironment, removeEnvironment } = useBudgetEnvironments(currentBudget?.id);
  
  // Filter clients based on search
  const filteredClients = clientsData?.data?.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearch.toLowerCase())
  ) || [];

  const environmentOptions = [
    'Ambiente manual',
    'Ambiente Promob',
    'Ambiente Dinabox', 
    'Ambiente Upmobb',
    'Ambiente Freire',
    'Ambiente WPS',
    'Serviços',
    'Itens adicionais'
  ];

  const handleBackNavigation = () => {
    if (onNavigate) {
      onNavigate('orcamentos');
    } else {
      // Fallback for direct access
      window.history.back();
    }
  };

  const handleCreateBudget = async () => {
    if (!clientSearch.trim()) {
      toast.error('Selecione um cliente');
      return null;
    }

    const budget = await createBudget({
      client_name: clientSearch,
      initial_date: initialDate,
      budget_observations: budgetObservations,
      final_considerations: finalConsiderations,
    });

    if (budget) {
      setCurrentBudget(budget);
      return budget;
    }
    return null;
  };

  const handleAddEnvironment = async () => {
    if (!customEnvironment.trim()) {
      toast.error('Digite o nome do ambiente');
      return;
    }
    
    let budgetToUse = currentBudget;
    if (!budgetToUse) {
      budgetToUse = await handleCreateBudget();
      if (!budgetToUse) return;
    }
    
    const result = await addEnvironment({
      environment_name: customEnvironment,
      environment_description: environmentDescription,
      quantity: parseInt(quantity),
      price: parseFloat(price) || 0,
    });

    if (result) {
      // Reset form
      setCustomEnvironment('');
      setEnvironmentDescription('');
      setQuantity('1');
      setPrice('');
    }
  };

  const handleEditEnvironment = (environment: any) => {
    setCustomEnvironment(environment.environment_name);
    setEnvironmentDescription(environment.environment_description || '');
    setQuantity(environment.quantity.toString());
    setPrice(environment.price.toString());
  };

  const handleRemoveEnvironment = async (id: string) => {
    await removeEnvironment(id);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Orçamento: {currentBudget?.id ? currentBudget.id.slice(-3) : '668'}</h1>
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
                    <Input 
                      type="date" 
                      value={initialDate}
                      onChange={(e) => setInitialDate(e.target.value)}
                    />
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

                <div className="space-y-6">
                  {/* Adicione ambiente/serviço Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Adicione ambiente/serviço</Label>
                    </div>
                    
                    <div className="relative">
                      <Button 
                        onClick={() => setShowEnvironmentDropdown(!showEnvironmentDropdown)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Adicionar <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      
                      {showEnvironmentDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-lg shadow-lg z-10">
                          {environmentOptions.map((env, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-4 py-2 hover:bg-muted text-sm border-b last:border-b-0"
                              onClick={() => {
                                setCustomEnvironment(env);
                                setShowEnvironmentDropdown(false);
                              }}
                            >
                              {env}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Environment Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      <div className="lg:col-span-8 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ambiente">Ambiente</Label>
                          <Input
                            value={customEnvironment}
                            onChange={(e) => setCustomEnvironment(e.target.value)}
                            placeholder="Suíte master"
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Descrição do ambiente</Label>
                          <RichTextEditor
                            value={environmentDescription}
                            onChange={setEnvironmentDescription}
                            placeholder="Digite a descrição do ambiente..."
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantidade">Quantidade</Label>
                          <Select value={quantity} onValueChange={setQuantity}>
                            <SelectTrigger>
                              <SelectValue placeholder="1" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="preco">Preço</Label>
                          <Input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Preço"
                            type="number"
                            step="0.01"
                            className="w-full"
                          />
                        </div>

                        <Button 
                          onClick={handleAddEnvironment}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Display Added Environments */}
                  {environments && environments.length > 0 && (
                    <Card className="mt-6">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold">Ambientes Adicionados</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/30">
                              <tr>
                                <th className="text-left p-4 border-r">Nome do ambiente</th>
                                <th className="text-left p-4 border-r">Descrição do ambiente</th>
                                <th className="text-center p-4 border-r w-24">Quantidade</th>
                                <th className="text-center p-4 border-r w-32">Preço</th>
                                <th className="text-center p-4 border-r w-32">Sub-total</th>
                                <th className="text-center p-4 w-24">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {environments.map((env) => (
                                <tr key={env.id} className="border-b">
                                  <td className="p-4 border-r font-bold text-lg">
                                    {env.environment_name}
                                  </td>
                                  <td className="p-4 border-r text-sm">
                                    {env.environment_description ? (
                                      <div dangerouslySetInnerHTML={{ __html: env.environment_description }} />
                                    ) : (
                                      <span className="text-muted-foreground">Nenhuma descrição</span>
                                    )}
                                  </td>
                                  <td className="text-center p-4 border-r font-medium">{env.quantity}</td>
                                  <td className="text-center p-4 border-r font-medium">R$ {env.price.toFixed(2)}</td>
                                  <td className="text-center p-4 border-r font-bold">R$ {env.subtotal.toFixed(2)}</td>
                                  <td className="text-center p-4">
                                    <div className="flex justify-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditEnvironment(env)}
                                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                                      >
                                        💾
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleRemoveEnvironment(env.id)}
                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Observações e Considerações */}
                        <div className="p-6 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Observações do orçamento</h4>
                              <RichTextEditor
                                value={budgetObservations}
                                onChange={setBudgetObservations}
                                placeholder="Digite suas observações..."
                                className="w-full"
                              />
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Considerações finais</h4>
                              <RichTextEditor
                                value={finalConsiderations}
                                onChange={setFinalConsiderations}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
                    <span>Ambientes: <strong>R$ {environments?.reduce((sum, env) => sum + env.subtotal, 0).toFixed(2) || '0,00'}</strong></span>
                    <span>Serviços: <strong>R$ 0,00</strong></span>
                    <span>Adicionais: <strong>R$ 0,00</strong></span>
                    <span>Total: <strong>R$ {environments?.reduce((sum, env) => sum + env.subtotal, 0).toFixed(2) || '0,00'}</strong></span>
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