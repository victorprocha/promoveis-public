import React, { useState } from 'react';
import { ArrowLeft, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useToast } from '@/hooks/use-toast';

interface NovoColaboradorProps {
  onBack: () => void;
}

const NovoColaborador: React.FC<NovoColaboradorProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('informacoes-gerais');
  const [tipoPessoa, setTipoPessoa] = useState('fisica');
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cargo: ''
  });
  
  const { addCollaborator } = useCollaborators();
  const { toast } = useToast();

  const sections = [
    { id: 'informacoes-gerais', label: 'informações gerais', icon: User },
    { id: 'endereco', label: 'endereço', icon: MapPin }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = async () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCollaborator({
        name: formData.nome,
        role: formData.cargo,
        email: formData.email || undefined,
        phone: formData.telefone || undefined
      });
      onBack();
    } catch (error) {
      // Error already handled by the hook
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="text-sm text-slate-500">
            Colaborador &gt; <span className="text-slate-800 font-medium">Novo Colaborador</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Informações Gerais */}
            <Card id="informacoes-gerais" className="bg-white/60 backdrop-blur-sm shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipo de Pessoa */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Tipo de Pessoa</Label>
                  <RadioGroup
                    value={tipoPessoa}
                    onValueChange={setTipoPessoa}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fisica" id="fisica" />
                      <Label htmlFor="fisica">Pessoa Física</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="juridica" id="juridica" />
                      <Label htmlFor="juridica">Pessoa Jurídica</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Grid de Campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium text-slate-700">
                      Nome*
                    </Label>
                    <Input 
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="border-b-2 border-t-0 border-l-0 border-r-0 border-blue-400 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apelido" className="text-sm font-medium text-slate-700">
                      Apelido
                    </Label>
                    <Input 
                      id="apelido" 
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nascimento" className="text-sm font-medium text-slate-700">
                      Data de Nascimento
                    </Label>
                    <Input 
                      id="nascimento" 
                      type="date"
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nacionalidade" className="text-sm font-medium text-slate-700">
                      Nacionalidade
                    </Label>
                    <Select>
                      <SelectTrigger className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600">
                        <SelectValue placeholder="Brasileira" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brasileira">Brasileira</SelectItem>
                        <SelectItem value="estrangeira">Estrangeira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-sm font-medium text-slate-700">
                      CPF
                    </Label>
                    <Input 
                      id="cpf" 
                      placeholder="000.000.000-00"
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rg" className="text-sm font-medium text-slate-700">
                      RG
                    </Label>
                    <Input 
                      id="rg" 
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-medium text-slate-700">
                      Telefone
                    </Label>
                    <Input 
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo-telefone" className="text-sm font-medium text-slate-700">
                      Tipo
                    </Label>
                    <Select>
                      <SelectTrigger className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600">
                        <SelectValue placeholder="Celular" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="celular">Celular</SelectItem>
                        <SelectItem value="residencial">Residencial</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      E-mail
                    </Label>
                    <Input 
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      type="email"
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admissao" className="text-sm font-medium text-slate-700">
                      Data de Admissão*
                    </Label>
                    <Input 
                      id="admissao" 
                      type="date"
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargo" className="text-sm font-medium text-slate-700">
                      Cargo*
                    </Label>
                    <Select value={formData.cargo} onValueChange={(value) => handleInputChange('cargo', value)}>
                      <SelectTrigger className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600">
                        <SelectValue placeholder="selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diretor">DIRETOR</SelectItem>
                        <SelectItem value="consultor-vendas">CONSULTOR DE VENDAS</SelectItem>
                        <SelectItem value="consultor-implantacao">CONSULTOR DE IMPLANTAÇÃO</SelectItem>
                        <SelectItem value="montador">MONTADOR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card id="endereco" className="bg-white/60 backdrop-blur-sm shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-sm font-medium text-slate-700">
                      CEP
                    </Label>
                    <Input 
                      id="cep" 
                      placeholder="00000-000"
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logradouro" className="text-sm font-medium text-slate-700">
                      Logradouro
                    </Label>
                    <Input 
                      id="logradouro" 
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero" className="text-sm font-medium text-slate-700">
                      Número
                    </Label>
                    <Input 
                      id="numero" 
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bairro" className="text-sm font-medium text-slate-700">
                      Bairro
                    </Label>
                    <Input 
                      id="bairro" 
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complemento" className="text-sm font-medium text-slate-700">
                      Complemento
                    </Label>
                    <Input 
                      id="complemento" 
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-sm font-medium text-slate-700">
                      Cidade
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="cidade" 
                        className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                      />
                      <span className="text-xs text-slate-500">Não informado</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uf" className="text-sm font-medium text-slate-700">
                      UF
                    </Label>
                    <div className="text-sm text-slate-500">Não informado</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pais" className="text-sm font-medium text-slate-700">
                      País
                    </Label>
                    <div className="text-sm text-slate-500">Não informado</div>
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="referencia" className="text-sm font-medium text-slate-700">
                      Referência
                    </Label>
                    <Input 
                      id="referencia" 
                      className="border-b border-t-0 border-l-0 border-r-0 border-slate-300 rounded-none bg-transparent focus:border-blue-600" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="w-64 bg-white/60 backdrop-blur-sm border-l border-slate-200/50 p-4">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-slate-600"
          >
            CANCELAR
          </Button>
          <Button onClick={handleConfirm} className="bg-blue-500 hover:bg-blue-600 text-white">
            CONFIRMAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NovoColaborador;