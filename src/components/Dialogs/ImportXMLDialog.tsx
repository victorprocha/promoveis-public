import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImportXMLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (xmlData: any) => void;
}

export const ImportXMLDialog: React.FC<ImportXMLDialogProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/xml') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML válido.",
        variant: "destructive",
      });
      setSelectedFile(null);
    }
  };

  const parseXMLToProducts = (xmlContent: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Buscar produtos no XML (adaptável para diferentes formatos)
    const products = [];
    const items = xmlDoc.querySelectorAll('item, produto, product');
    
    items.forEach((item, index) => {
      const product = {
        id: `temp-${index}`,
        codigo: item.querySelector('codigo, code, id')?.textContent || `PROD-${index + 1}`,
        descricao: item.querySelector('descricao, description, name')?.textContent || `Produto ${index + 1}`,
        quantidade: parseFloat(item.querySelector('quantidade, qty, quantity')?.textContent || '1'),
        unidade: item.querySelector('unidade, unit')?.textContent || 'CH',
        altura_metros: parseFloat(item.querySelector('altura, height')?.textContent || '0'),
        largura_metros: parseFloat(item.querySelector('largura, width')?.textContent || '0'),
        preco_unitario: parseFloat(item.querySelector('precoUnitario, unitPrice, price')?.textContent || '0'),
      };
      products.push(product);
    });

    // Se não encontrou produtos com as tags padrão, tenta extrair de outras estruturas
    if (products.length === 0) {
      // Exemplo para estrutura mais genérica
      const allElements = xmlDoc.querySelectorAll('*');
      let tempProducts = [];
      
      // Busca por padrões comuns em XMLs de pedido
      const possibleProducts = xmlDoc.querySelectorAll('[codigo], [descricao], [produto]');
      possibleProducts.forEach((element, index) => {
        if (element.textContent && element.textContent.trim()) {
          tempProducts.push({
            id: `temp-${index}`,
            codigo: `PROD-${index + 1}`,
            descricao: element.textContent.trim(),
            quantidade: 1,
            unidade: 'CH',
            altura_metros: 1.84,
            largura_metros: 2.75,
            preco_unitario: 0,
          });
        }
      });
      
      return tempProducts.slice(0, 10); // Limita a 10 produtos para evitar sobrecarga
    }

    return products;
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
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlContent = e.target?.result as string;
        const products = parseXMLToProducts(xmlContent);
        
        if (products.length === 0) {
          toast({
            title: "Aviso",
            description: "Nenhum produto foi encontrado no arquivo XML.",
            variant: "destructive",
          });
          return;
        }

        onImport(products);
        onOpenChange(false);
        setSelectedFile(null);
        
        toast({
          title: "Sucesso",
          description: `${products.length} produtos importados com sucesso!`,
        });
      };
      
      reader.onerror = () => {
        toast({
          title: "Erro",
          description: "Erro ao ler o arquivo XML.",
          variant: "destructive",
        });
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo XML.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar XML do pedido de compra do fornecedor</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              Selecione o arquivo XML
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="xmlFile">Escolher arquivo</Label>
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
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};