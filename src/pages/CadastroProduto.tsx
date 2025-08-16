import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CadastroProdutoProps {
  onBack: () => void;
}

const CadastroProduto: React.FC<CadastroProdutoProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    descricao: '',
    unidade: 'UN - UNIDADE',
    marca: '',
    acabamento: '',
    fornecedor: '',
    estoque: '',
    estoqueMinimo: '',
    precoCompra: '0,00',
    localizacao: 'Ex: corredor D'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validação básica
    if (!formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Descrição é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (!formData.estoque.trim()) {
      toast({
        title: "Erro",
        description: "Estoque é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!formData.estoqueMinimo.trim()) {
      toast({
        title: "Erro",
        description: "Estoque Mínimo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria feita a chamada para salvar no banco de dados
    toast({
      title: "Sucesso",
      description: "Produto cadastrado com sucesso!",
      variant: "default",
    });

    // Limpar formulário
    setFormData({
      descricao: '',
      unidade: 'UN - UNIDADE',
      marca: '',
      acabamento: '',
      fornecedor: '',
      estoque: '',
      estoqueMinimo: '',
      precoCompra: '0,00',
      localizacao: 'Ex: corredor D'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <span>Home</span> &gt; <span>Estoqueeferência</span> &gt; <span>Adicionar</span>
      </nav>

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded"></div>
            Cadastrar Produto no Almoxarifado
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Alert informativo */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          Obrigatório o preenchimento dos campos com asterisco.
        </AlertDescription>
      </Alert>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Digite a descrição do produto"
              />
            </div>

            {/* Unidade */}
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select value={formData.unidade} onValueChange={(value) => handleInputChange('unidade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UN - UNIDADE">UN - UNIDADE</SelectItem>
                  <SelectItem value="KG - QUILOGRAMA">KG - QUILOGRAMA</SelectItem>
                  <SelectItem value="M - METRO">M - METRO</SelectItem>
                  <SelectItem value="M2 - METRO QUADRADO">M2 - METRO QUADRADO</SelectItem>
                  <SelectItem value="L - LITRO">L - LITRO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                placeholder="Digite a marca"
              />
            </div>

            {/* Acabamento */}
            <div className="space-y-2">
              <Label htmlFor="acabamento">Acabamento</Label>
              <Input
                id="acabamento"
                value={formData.acabamento}
                onChange={(e) => handleInputChange('acabamento', e.target.value)}
                placeholder="Digite o acabamento"
              />
            </div>

            {/* Fornecedor */}
            <div className="space-y-2">
              <Label htmlFor="fornecedor">
                Fornecedor <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.fornecedor} onValueChange={(value) => handleInputChange('fornecedor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fornecedor1">Fornecedor 1</SelectItem>
                  <SelectItem value="fornecedor2">Fornecedor 2</SelectItem>
                  <SelectItem value="fornecedor3">Fornecedor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estoque */}
            <div className="space-y-2">
              <Label htmlFor="estoque">
                Estoque <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estoque"
                type="number"
                value={formData.estoque}
                onChange={(e) => handleInputChange('estoque', e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Estoque Mínimo */}
            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo">
                Estoque Mínimo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estoqueMinimo"
                type="number"
                value={formData.estoqueMinimo}
                onChange={(e) => handleInputChange('estoqueMinimo', e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Preço de Compra */}
            <div className="space-y-2">
              <Label htmlFor="precoCompra">
                Preço de Compra <span className="text-red-500">*</span>
              </Label>
              <Input
                id="precoCompra"
                value={formData.precoCompra}
                onChange={(e) => handleInputChange('precoCompra', e.target.value)}
                placeholder="0,00"
              />
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => handleInputChange('localizacao', e.target.value)}
                placeholder="Ex: corredor D"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-success text-white hover:bg-success/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroProduto;