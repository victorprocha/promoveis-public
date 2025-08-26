
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, CheckCircle2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportPromobXMLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onImportSuccess: () => void;
}

export const ImportPromobXMLDialog: React.FC<ImportPromobXMLDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const { toast } = useToast();

  const N8N_WEBHOOK_URL = 'https://victorprocha.app.n8n.cloud/webhook-test/leitorxml';

  const sendFileToN8N = async (file: File, xmlContent: string) => {
    console.log('[N8N] Enviando arquivo para n8n webhook:', N8N_WEBHOOK_URL);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('fileSize', file.size.toString());
      formData.append('projectId', projectId);
      formData.append('xmlContent', xmlContent);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      console.log('[N8N] Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.text();
        console.log('[N8N] Arquivo enviado com sucesso para n8n:', responseData);
        
        return {
          success: true,
          message: 'Arquivo enviado com sucesso para processamento no n8n.',
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
      setImportResult(null);
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
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const xmlContent = e.target?.result as string;
          console.log('[ImportPromobXMLDialog] Conteúdo do arquivo lido, enviando para n8n...');
          
          const result = await sendFileToN8N(selectedFile, xmlContent);
          
          setImportResult({
            success: true,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            message: result.message
          });
          
          toast({
            title: "Sucesso",
            description: "Arquivo XML enviado com sucesso para processamento no n8n.",
          });

          onImportSuccess();
          
        } catch (error) {
          console.error('[ImportPromobXMLDialog] Erro ao processar XML:', error);
          toast({
            title: "Erro",
            description: error instanceof Error ? error.message : "Erro ao enviar o arquivo para o n8n.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('[ImportPromobXMLDialog] Erro ao ler arquivo:', error);
        toast({
          title: "Erro",
          description: "Erro ao ler o arquivo XML.",
          variant: "destructive",
        });
        setLoading(false);
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error('[ImportPromobXMLDialog] Erro geral:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo XML.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImportResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Arquivo XML do Promob</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!importResult ? (
            <>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  Selecione o arquivo XML exportado do Promob para enviar para processamento no n8n.
                  O arquivo será processado automaticamente e os dados serão importados para o sistema.
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
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar para n8n
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
                    <p className="font-medium text-green-800">Arquivo enviado com sucesso!</p>
                    <p className="text-sm text-green-600 mt-1">
                      O arquivo está sendo processado pelo n8n
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Detalhes do envio:</h4>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Nome do arquivo</div>
                    <div className="text-lg font-bold text-blue-600">
                      {importResult.fileName}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Tamanho</div>
                    <div className="text-lg font-bold text-green-600">
                      {(importResult.fileSize / 1024).toFixed(2)} KB
                    </div>
                  </div>
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
