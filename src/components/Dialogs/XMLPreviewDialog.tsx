
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Database, User, Package } from "lucide-react";
import { XMLStructure, PromobSection } from "@/utils/xmlParser";

interface XMLPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xmlStructure: XMLStructure;
  onProceed: () => void;
}

export const XMLPreviewDialog: React.FC<XMLPreviewDialogProps> = ({
  open,
  onOpenChange,
  xmlStructure,
  onProceed,
}) => {
  const getStructureIcon = () => {
    switch (xmlStructure.type) {
      case 'promob':
        return <Database className="h-5 w-5 text-blue-600" />;
      case 'traditional':
        return <FileText className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStructureLabel = () => {
    switch (xmlStructure.type) {
      case 'promob':
        return 'Promob XML';
      case 'traditional':
        return 'XML Tradicional';
      default:
        return 'Estrutura Desconhecida';
    }
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case 'CUSTOMERSDATA':
        return <User className="h-4 w-4" />;
      case 'ITEMSDATA':
        return <Package className="h-4 w-4" />;
      case 'BUDGETDATA':
        return <Database className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderSection = (section: PromobSection) => (
    <div key={section.name} className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        {getSectionIcon(section.name)}
        <h4 className="font-semibold text-gray-800">{section.name}</h4>
        <Badge variant="secondary">{section.data.length} itens</Badge>
      </div>
      
      <ScrollArea className="h-40">
        <div className="space-y-1">
          {section.data.slice(0, 10).map((item, index) => (
            <div key={index} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span className="font-mono text-blue-600">{item.id}</span>
              <span className="text-gray-700 truncate ml-2">{item.value}</span>
            </div>
          ))}
          {section.data.length > 10 && (
            <div className="text-sm text-gray-500 py-2 text-center">
              ... e mais {section.data.length - 10} itens
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStructureIcon()}
            Preview da Estrutura XML - {getStructureLabel()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo da estrutura */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Estrutura detectada:</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Dados do Cliente: {xmlStructure.hasCustomerData ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Dados de Itens: {xmlStructure.hasItemsData ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Dados do Orçamento: {xmlStructure.hasBudgetData ? '✓' : '✗'}</span>
              </div>
            </div>
          </div>

          {/* Seções do XML */}
          {xmlStructure.sections.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {xmlStructure.sections.map(renderSection)}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma seção estruturada foi detectada no XML.</p>
              <p className="text-sm mt-2">O sistema tentará processar usando métodos alternativos.</p>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={onProceed}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={xmlStructure.type === 'unknown'}
            >
              Prosseguir com Importação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
