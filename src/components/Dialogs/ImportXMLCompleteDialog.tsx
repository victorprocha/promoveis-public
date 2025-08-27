
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { JSONViewer } from "@/components/Common/JSONViewer";
import { parseXMLToStructuredData, DadosConvertidos } from "@/utils/xmlParser";

interface ImportXMLCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (dadosConvertidos: DadosConvertidos) => void;
}

export const ImportXMLCompleteDialog: React.FC<ImportXMLCompleteDialogProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dadosConvertidos, setDadosConvertidos] = useState<DadosConvertidos | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.xml')) {
      setSelectedFile(file);
      setDadosConvertidos(null);
      console.log('[ImportXMLCompleteDialog] Arquivo selecionado:', file.name);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML válido.",
        variant: "destructive",
      });
      setSelectedFile(null);
    }
  };

  const handleProcessXML = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('[ImportXMLCompleteDialog] Processando arquivo XML localmente...');
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xmlContent = e.target?.result as string;
          console.log('[ImportXMLCompleteDialog] Conteúdo XML lido, processando...');
          
          const dadosProcessados = parseXMLToStructuredData(xmlContent);
          setDadosConvertidos(dadosProcessados);
          
          toast({
            title: "Sucesso",
            description: "Arquivo XML processado com sucesso!",
          });
          
          console.log('[ImportXMLCompleteDialog] Dados convertidos:', dadosProcessados);
        } catch (error) {
          console.error('[ImportXMLCompleteDialog] Erro ao processar XML:', error);
          toast({
            title: "Erro",
            description: error instanceof Error ? error.message : "Erro ao processar arquivo XML.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setLoading(false);
        toast({
          title: "Erro",
          description: "Erro ao ler arquivo XML.",
          variant: "destructive",
        });
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      setLoading(false);
      console.error('[ImportXMLCompleteDialog] Erro geral:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (dadosConvertidos) {
      onImport(dadosConvertidos);
      handleCancel();
      toast({
        title: "Sucesso",
        description: "Dados importados com sucesso!",
      });
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setDadosConvertidos(null);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar e Processar XML
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Upload className="h-16 w-16 animate-spin text-primary" />
              <p className="text-lg font-medium">Processando arquivo XML...</p>
              <p className="text-sm text-muted-foreground">Convertendo XML para JSON estruturado</p>
            </div>
          ) : !dadosConvertidos ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nova funcionalidade:</strong> Agora o processamento é feito localmente no seu navegador!
                  <br />
                  Selecione um arquivo XML para converter automaticamente em dados estruturados.
                </p>
              </div>

              <div className="space-y-3">
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
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      <strong>Arquivo:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                
                <Button 
                  onClick={handleProcessXML}
                  disabled={!selectedFile}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Processar XML
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">XML processado com sucesso!</p>
                    <p className="text-sm text-green-600 mt-1">
                      Dados convertidos e estruturados • Processado em {new Date(dadosConvertidos.processedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumo rápido */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {dadosConvertidos.ambientes.length}
                  </div>
                  <div className="text-sm text-gray-600">Ambiente(s)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dadosConvertidos.ambientes.reduce((total, amb) => total + amb.itens.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Item(s)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    R$ {dadosConvertidos.resumoFinanceiro.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600">Valor Total</div>
                </div>
              </div>

              {/* JSON Viewer */}
              <JSONViewer 
                data={dadosConvertidos} 
                title="dadosConvertidos - Dados Estruturados do XML"
                downloadFilename={`dados-convertidos-${selectedFile?.name?.replace('.xml', '') || 'xml'}.json`}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleImport} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Importar Dados
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
