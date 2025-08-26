import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, CheckCircle2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeXMLStructure, extractPromobData, XMLStructure } from "@/utils/xmlParser";
import { XMLPreviewDialog } from "./XMLPreviewDialog";

interface ImportPromobXMLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onImportSuccess: () => void;
}

interface ParsedData {
  orcamento: any;
  ambientes: any[];
  categorias: any[];
  itens: any[];
  subitens: any[];
  margens: any[];
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
  const [xmlStructure, setXmlStructure] = useState<XMLStructure | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [xmlContent, setXmlContent] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.xml')) {
      setSelectedFile(file);
      setImportResult(null);
      setXmlStructure(null);
      setXmlContent('');
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML válido.",
        variant: "destructive",
      });
      setSelectedFile(null);
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setXmlContent(content);
        
        console.log('[Import Dialog] Iniciando análise do XML...');
        const structure = analyzeXMLStructure(content);
        setXmlStructure(structure);
        
        if (structure.type === 'unknown') {
          toast({
            title: "Estrutura não reconhecida",
            description: "O arquivo XML não possui uma estrutura reconhecida pelo sistema.",
            variant: "destructive",
          });
        } else {
          console.log(`[Import Dialog] Estrutura ${structure.type} detectada com sucesso`);
        }
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
      console.error('[Import Dialog] Erro na análise:', error);
      toast({
        title: "Erro",
        description: "Erro ao analisar o arquivo XML.",
        variant: "destructive",
      });
    }
  };

  const parseXMLToPromobData = (xmlContent: string): ParsedData => {
    console.log('[Import Dialog] Iniciando parsing do XML...');
    
    const structure = analyzeXMLStructure(xmlContent);
    
    if (structure.type === 'promob') {
      console.log('[Import Dialog] Usando parser Promob');
      const promobData = extractPromobData(structure);
      
      if (promobData) {
        console.log('[Import Dialog] Dados extraídos com sucesso do Promob');
        return promobData;
      }
    }
    
    // Fallback para estrutura tradicional
    console.log('[Import Dialog] Usando parser tradicional como fallback');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    if (xmlDoc.documentElement.nodeName === 'parsererror') {
      throw new Error('Erro ao fazer parse do XML');
    }

    // Parse orçamento principal
    const orcamento = {
      data_orcamento: new Date().toISOString().split('T')[0],
      ambiente_principal: xmlDoc.querySelector('ambiente')?.getAttribute('nome') || 'Ambiente Principal',
      situacao: 'Importado',
      etapa: 'Análise',
      valor_pedido: parseFloat(xmlDoc.querySelector('totalPedido')?.textContent || '0'),
      valor_orcamento: parseFloat(xmlDoc.querySelector('totalOrcamento')?.textContent || '0'),
      acrescimo: parseFloat(xmlDoc.querySelector('acrescimo')?.textContent || '0'),
      frete: parseFloat(xmlDoc.querySelector('frete')?.textContent || '0'),
      montagem: parseFloat(xmlDoc.querySelector('montagem')?.textContent || '0'),
      impostos: parseFloat(xmlDoc.querySelector('impostos')?.textContent || '0'),
      descontos: parseFloat(xmlDoc.querySelector('descontos')?.textContent || '0'),
    };

    // Parse ambientes
    const ambientesElements = xmlDoc.querySelectorAll('ambiente');
    const ambientes = Array.from(ambientesElements).map((ambiente, index) => ({
      descricao: ambiente.getAttribute('nome') || `Ambiente ${index + 1}`,
      total_pedido: parseFloat(ambiente.querySelector('totalPedido')?.textContent || '0'),
      total_orcamento: parseFloat(ambiente.querySelector('totalOrcamento')?.textContent || '0'),
    }));

    // Parse categorias
    const categoriasElements = xmlDoc.querySelectorAll('categoria');
    const categorias = Array.from(categoriasElements).map((categoria, index) => ({
      descricao: categoria.getAttribute('nome') || categoria.textContent || `Categoria ${index + 1}`,
      total_pedido: parseFloat(categoria.querySelector('totalPedido')?.textContent || '0'),
      total_orcamento: parseFloat(categoria.querySelector('totalOrcamento')?.textContent || '0'),
      ambiente_index: 0, // Associar ao primeiro ambiente por padrão
    }));

    // Parse itens
    const itensElements = xmlDoc.querySelectorAll('item');
    const itens = Array.from(itensElements).map((item, index) => {
      const largura = parseFloat(item.querySelector('largura')?.textContent || '0');
      const altura = parseFloat(item.querySelector('altura')?.textContent || '0');
      const profundidade = parseFloat(item.querySelector('profundidade')?.textContent || '0');
      
      return {
        descricao: item.querySelector('descricao')?.textContent || `Item ${index + 1}`,
        referencia: item.querySelector('referencia')?.textContent || '',
        quantidade: parseInt(item.querySelector('quantidade')?.textContent || '1'),
        unidade: item.querySelector('unidade')?.textContent || 'UN',
        largura,
        altura,
        profundidade,
        dimensoes: `${largura}x${altura}x${profundidade}`,
        valor_total: parseFloat(item.querySelector('valor')?.textContent || '0'),
        categoria_index: 0, // Associar à primeira categoria por padrão
      };
    });

    // Parse subitens (componentes)
    const subItensElements = xmlDoc.querySelectorAll('componente, subitem');
    const subitens = Array.from(subItensElements).map((subitem, index) => {
      const largura = parseFloat(subitem.querySelector('largura')?.textContent || '0');
      const altura = parseFloat(subitem.querySelector('altura')?.textContent || '0');
      const profundidade = parseFloat(subitem.querySelector('profundidade')?.textContent || '0');
      
      return {
        descricao: subitem.querySelector('descricao')?.textContent || `Subitem ${index + 1}`,
        referencia: subitem.querySelector('referencia')?.textContent || '',
        quantidade: parseInt(subitem.querySelector('quantidade')?.textContent || '1'),
        unidade: subitem.querySelector('unidade')?.textContent || 'UN',
        largura,
        altura,
        profundidade,
        dimensoes: `${largura}x${altura}x${profundidade}`,
        valor_total: parseFloat(subitem.querySelector('valor')?.textContent || '0'),
        item_index: 0, // Associar ao primeiro item por padrão
      };
    });

    // Parse margens (impostos, descontos, acréscimos)
    const margens: any[] = [];
    
    const impostosElements = xmlDoc.querySelectorAll('imposto');
    Array.from(impostosElements).forEach(imposto => {
      margens.push({
        entidade_tipo: 'orcamento',
        tipo: 'imposto',
        descricao: imposto.querySelector('descricao')?.textContent || 'Imposto',
        valor: parseFloat(imposto.querySelector('valor')?.textContent || '0'),
      });
    });

    const descontosElements = xmlDoc.querySelectorAll('desconto');
    Array.from(descontosElements).forEach(desconto => {
      margens.push({
        entidade_tipo: 'orcamento',
        tipo: 'desconto',
        descricao: desconto.querySelector('descricao')?.textContent || 'Desconto',
        valor: parseFloat(desconto.querySelector('valor')?.textContent || '0'),
      });
    });

    return {
      orcamento,
      ambientes,
      categorias,
      itens,
      subitens,
      margens
    };
  };

  const savePromobDataToDatabase = async (parsedData: ParsedData) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // 1. Criar orçamento
    const { data: orcamentoData, error: orcamentoError } = await supabase
      .from('orcamentos')
      .insert({
        user_id: user.id,
        project_id: projectId,
        ...parsedData.orcamento
      })
      .select()
      .single();

    if (orcamentoError) throw orcamentoError;

    // 2. Criar ambientes
    const ambientesWithOrcamentoId = parsedData.ambientes.map(ambiente => ({
      ...ambiente,
      orcamento_id: orcamentoData.id
    }));

    const { data: ambientesData, error: ambientesError } = await supabase
      .from('ambientes')
      .insert(ambientesWithOrcamentoId)
      .select();

    if (ambientesError) throw ambientesError;

    // 3. Criar categorias
    if (parsedData.categorias.length > 0 && ambientesData && ambientesData.length > 0) {
      const categoriasWithAmbienteId = parsedData.categorias.map(categoria => ({
        ...categoria,
        ambiente_id: ambientesData[categoria.ambiente_index] || ambientesData[0].id
      }));

      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias')
        .insert(categoriasWithAmbienteId)
        .select();

      if (categoriasError) throw categoriasError;

      // 4. Criar itens
      if (parsedData.itens.length > 0 && categoriasData && categoriasData.length > 0) {
        const itensWithCategoriaId = parsedData.itens.map(item => ({
          ...item,
          categoria_id: categoriasData[item.categoria_index] || categoriasData[0].id
        }));

        const { data: itensData, error: itensError } = await supabase
          .from('itens')
          .insert(itensWithCategoriaId)
          .select();

        if (itensError) throw itensError;

        // 5. Criar subitens
        if (parsedData.subitens.length > 0 && itensData && itensData.length > 0) {
          const subItensWithItemId = parsedData.subitens.map(subitem => ({
            ...subitem,
            item_id: itensData[subitem.item_index] || itensData[0].id
          }));

          const { error: subItensError } = await supabase
            .from('subitens')
            .insert(subItensWithItemId);

          if (subItensError) throw subItensError;
        }
      }
    }

    // 6. Criar margens
    if (parsedData.margens.length > 0) {
      const margensWithEntidadeId = parsedData.margens.map(margem => ({
        ...margem,
        entidade_id: orcamentoData.id
      }));

      const { error: margensError } = await supabase
        .from('margens')
        .insert(margensWithEntidadeId);

      if (margensError) throw margensError;
    }

    return {
      orcamento: orcamentoData,
      ambientes: ambientesData,
      totalItens: parsedData.itens.length,
      totalSubitens: parsedData.subitens.length
    };
  };

  const handlePreview = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML.",
        variant: "destructive",
      });
      return;
    }

    await analyzeFile();
    setShowPreview(true);
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
      reader.onload = async (e) => {
        try {
          const xmlContent = e.target?.result as string;
          const parsedData = parseXMLToPromobData(xmlContent);
          
          if (parsedData.ambientes.length === 0) {
            toast({
              title: "Aviso",
              description: "Nenhum ambiente foi encontrado no arquivo XML.",
              variant: "destructive",
            });
            return;
          }

          const result = await savePromobDataToDatabase(parsedData);
          setImportResult(result);
          
          toast({
            title: "Sucesso",
            description: `Orçamento importado com sucesso! ${result.ambientes?.length || 0} ambientes e ${result.totalItens} itens processados.`,
          });

          onImportSuccess();
          
        } catch (error) {
          console.error('Erro ao processar XML:', error);
          toast({
            title: "Erro",
            description: error instanceof Error ? error.message : "Erro ao processar o arquivo XML.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Erro",
          description: "Erro ao ler o arquivo XML.",
          variant: "destructive",
        });
        setLoading(false);
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
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
    setXmlStructure(null);
    setXmlContent('');
    onOpenChange(false);
  };

  const handleProceedFromPreview = () => {
    setShowPreview(false);
    handleImport();
  };

  return (
    <>
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
                    Selecione o arquivo XML exportado do Promob para importar orçamento, ambientes, categorias e itens.
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
                  
                  {selectedFile && (
                    <Button 
                      variant="outline"
                      onClick={handlePreview}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                  )}
                  
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
              </>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Importação concluída com sucesso!</p>
                      <p className="text-sm text-green-600 mt-1">
                        Orçamento: {importResult.orcamento?.ambiente_principal}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Resumo da importação:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-medium text-gray-700">Ambientes</div>
                      <div className="text-lg font-bold text-blue-600">
                        {importResult.ambientes?.length || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-medium text-gray-700">Itens</div>
                      <div className="text-lg font-bold text-green-600">
                        {importResult.totalItens || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-medium text-gray-700">Subitens</div>
                      <div className="text-lg font-bold text-orange-600">
                        {importResult.totalSubitens || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-medium text-gray-700">Valor Total</div>
                      <div className="text-lg font-bold text-purple-600">
                        R$ {importResult.orcamento?.valor_orcamento?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
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

      {xmlStructure && (
        <XMLPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          xmlStructure={xmlStructure}
          onProceed={handleProceedFromPreview}
        />
      )}
    </>
  );
};
