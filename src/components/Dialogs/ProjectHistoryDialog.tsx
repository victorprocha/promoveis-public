import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface ProjectHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projeto: {
    id: string;
    name: string;
    client_name: string;
    etapa_atual: string;
    created_at: string;
  } | null;
}

const ETAPAS_FIXAS = [
  'Assinatura do Projeto',
  'Checklist Financeiro do Contrato',
  'Checklist Comercial do Contrato',
  'Liberação Financeira',
  'Liberação Comercial',
  'Medição do Ambiente',
  'Revisão dos Ambientes',
  'Assinatura da Pasta Executiva',
  'Compra dos Itens dos Ambientes',
  'Produção dos Itens do Ambiente',
  'Liberação de Obra',
  'Entrega dos Ambientes',
  'Montagem dos Ambientes',
  'Entrega Técnica',
  'Conclusão de Contrato'
];

const ProjectHistoryDialog: React.FC<ProjectHistoryDialogProps> = ({
  isOpen,
  onClose,
  projeto
}) => {
  console.log('ProjectHistoryDialog renderizando com:', { 
    isOpen, 
    projeto: projeto?.name,
    projetoCompleto: !!projeto 
  });
  
  if (!projeto) {
    console.log('Projeto é null/undefined, não renderizando dialog');
    return null;
  }

  const getEtapaIndex = (etapa: string) => {
    return ETAPAS_FIXAS.indexOf(etapa);
  };

  const currentEtapaIndex = getEtapaIndex(projeto.etapa_atual);

  const isEtapaConcluida = (etapa: string) => {
    const etapaIndex = getEtapaIndex(etapa);
    return etapaIndex <= currentEtapaIndex;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Histórico de Projetos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Projeto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Contrato:</span>
                <p className="text-gray-800">{projeto.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Projeto:</span>
                <p className="text-gray-800">{projeto.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Cliente:</span>
                <p className="text-gray-800">{projeto.client_name}</p>
              </div>
            </div>
          </div>

          {/* Tabela de Etapas */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                <div></div>
                <div>Data Início</div>
                <div>Data Final</div>
                <div>Valor Entrada</div>
                <div>Valor Saída</div>
                <div>Observações</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {ETAPAS_FIXAS.map((etapa, index) => {
                const isConcluida = isEtapaConcluida(etapa);
                const isAtual = etapa === projeto.etapa_atual;

                return (
                  <div
                    key={etapa}
                    className={`px-4 py-3 grid grid-cols-6 gap-4 text-sm ${
                      isAtual ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isConcluida
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-400 text-gray-700'
                        }`}
                      >
                        {isConcluida && <Check className="h-4 w-4" />}
                      </div>
                      <span className="text-gray-800 font-medium">{etapa}</span>
                    </div>
                    
                    <div className="text-gray-600">
                      {isConcluida ? formatDate(projeto.created_at) : 'Não informado'}
                    </div>
                    
                    <div className="text-gray-600">
                      {isConcluida ? formatDate(projeto.created_at) : 'Não informado'}
                    </div>
                    
                    <div className="text-gray-600">
                      Não informado
                    </div>
                    
                    <div className="text-gray-600">
                      Não informado
                    </div>
                    
                    <div className="text-gray-600">
                      {isAtual ? (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Em andamento
                        </Badge>
                      ) : isConcluida ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Concluído
                        </Badge>
                      ) : (
                        'Não informado'
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectHistoryDialog;