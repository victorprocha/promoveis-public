
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, CheckCircle2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ImportPromobXMLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onImportSuccess: () => void;
}

interface ImportedData {
  cliente: {
    nome: string;
    email: string;
    situacao: string;
    etapa: string;
    criado_em: string;
  };
  orcamento: {
    pedido: string;
    total: string;
  };
  ambientes: Array<{
    descricao: string;
    itens: Array<{
      codigo: string;
      descricao: string;
      quantidade: string;
      preco_unitario: string;
      preco_total: string;
    }>;
  }>;
}

export const ImportPromobXMLDialog: React.FC<ImportPromobXMLDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const { toast } = useToast();

  const N8N_WEBHOOK_URL = 'https://victorprocha.app.n8n.cloud/webhook/leitorxml';

  const sendFileToN8N = async (file: File) => {
    console.log('[N8N] Enviando arquivo para n8n webhook:', N8N_WEBHOOK_URL);
    
    try {
      const formData = new FormData();
      formData.append('data', file);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      console.log('[N8N] Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('[N8N] Dados recebidos do n8n:', responseData);
        
        return {
          success: true,
          data: responseData
        };
      } else {
        console.error('[N8N] Erro ao enviar arquivo para n8n:', response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('[N8N] Erro ao conectar com n8n:', error);
      throw error;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.xml')) {
      setSelectedFile(file);
      setImportedData(null);
      console.log('[ImportPromobXMLDialog] Arquivo selecionado:', file.name);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML válido.",
        variant: "destructive",
      });
      setSelectedFile(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('[ImportPromobXMLDialog] Iniciando processo de importação via n8n...');
    
    try {
      const result = await sendFileToN8N(selectedFile);
      
      if (result.success && result.data) {
        setImportedData(result.data);
        
        toast({
          title: "Sucesso",
          description: "Arquivo XML processado com sucesso!",
        });

        onImportSuccess();
      }
      
    } catch (error) {
      console.error('[ImportPromobXMLDialog] Erro ao processar XML:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar o arquivo XML.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImportedData(null);
    onOpenChange(false);
  };

  const formatCurrency = (value: string) => {
    return `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Arquivo XML do Promob</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!importedData ? (
            <>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  Selecione o arquivo XML exportado do Promob para processar automaticamente no n8n.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="xmlFile">Escolher arquivo XML</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="xmlFile"
                    type="file"
                    accept=".xml"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  {selectedFile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo selecionado: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                
                <Button 
                  onClick={handleImport}
                  disabled={!selectedFile || loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Arquivo
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Arquivo processado com sucesso!</p>
                    <p className="text-sm text-green-600 mt-1">
                      Dados importados e organizados
                    </p>
                  </div>
                </div>
              </div>

              {/* Dados do Cliente */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Dados do Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome</label>
                    <div className="bg-gray-50 p-2 rounded border mt-1">
                      {importedData.cliente.nome}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="bg-gray-50 p-2 rounded border mt-1">
                      {importedData.cliente.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Situação</label>
                    <div className="bg-gray-50 p-2 rounded border mt-1">
                      {importedData.cliente.situacao}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Etapa</label>
                    <div className="bg-gray-50 p-2 rounded border mt-1">
                      {importedData.cliente.etapa}
                    </div>
                  </div>
                </div>
              </div>

              {/* Orçamento */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Orçamento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded border">
                    <label className="text-sm font-medium text-gray-600">Valor do Pedido</label>
                    <div className="text-xl font-bold text-blue-600 mt-1">
                      {formatCurrency(importedData.orcamento.pedido)}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded border">
                    <label className="text-sm font-medium text-gray-600">Total</label>
                    <div className="text-xl font-bold text-green-600 mt-1">
                      {formatCurrency(importedData.orcamento.total)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambientes */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Ambientes</h3>
                <div className="space-y-4">
                  {importedData.ambientes.map((ambiente, ambienteIndex) => (
                    <div key={ambienteIndex} className="border rounded p-3">
                      <h4 className="font-medium text-gray-800 mb-3">{ambiente.descricao}</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Preço Unitário</TableHead>
                            <TableHead>Preço Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ambiente.itens.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              <TableCell className="font-medium">{item.codigo}</TableCell>
                              <TableCell>{item.descricao}</TableCell>
                              <TableCell>{item.quantidade}</TableCell>
                              <TableCell>{formatCurrency(item.preco_unitario)}</TableCell>
                              <TableCell className="font-semibold text-green-600">
                                {formatCurrency(item.preco_total)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleCancel}>
                  Fechar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
