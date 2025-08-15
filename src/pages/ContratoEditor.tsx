import React, { useState, useRef } from 'react';
import { ArrowLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ContratoEditorProps {
  onBack: () => void;
}

const ContratoEditor: React.FC<ContratoEditorProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [content, setContent] = useState(`DO OBJETO DO CONTRATO.

Cláusula 1ª - O presente contrato tem como OBJETO a compra e venda de móveis sobre medida 100% MDF da marca/empresa Dona empresaS, através de consultoria montagem e instalação pela CONTRATADA no endereço indicado pela CONTRATANTE de forma a serviço em projetos desenvolvidos pela Dona empresa.

Cláusula 2ª - Obriga-se a CONTRATADA a efetuar a entrega art n da Dona entregue com o prazo máximo de 60dias após montagem das cláusula para montagem, na mesma entrega art na data de entrega ou montagem após múltiplos maiores de artigos da partes, dessa às se comunicaram com 05 dias de antecedência por e-mail ou comunicação por outros.

Parágrafo único: Caso contido artigo a abastiss da entrega por conta das outras uma vez geral, será remunerada uma nova data de entrega com prazo máximo de 30 dias uteis.

Cláusula 3ª - O CONTRATANTE fica responsável de entregar a planta hidráulica e elétrica do imóvel, para evitar problemas com procedimentos ou descargas elétricas que possam ou acontecer, devido à função do imóvel. Caso este não seja fornecida, a CONTRATADA ficará isenta de qualquer dano que possa ser gerado.

Parágrafo Único: O presente contrato não inclui serviços de instalações hidráulicas e/ou elétrica realizadas aos imóveis montados pela CONTRATADA, instalação de eletrônicos e eletrodomésticos serão cobrados Taxas Extras que serão avisadas diretamente com o responsável pela montagem.

Cláusula 4ª - A CONTRATADA executará os serviços com material de qualidade e excelente padrão de acabamento, sendo dada GARANTIA DE garantia PARA PRODUTOS FORNECIDOS e FABRICADOS PELA CONTRATADA.

Parágrafo primeiro: Esta garantia ficará automaticamente cancelada na:

a) Danos sobre defeitos causados em qualquer componente do produto pela não manuseamento do mesmo por acidente e ação natural, ou outras - procedimento de danos causados por impactos, quedas etc.

b) Manchas das pinturas causadas por agentes químicos ou serviços dos produtos de limpeza inadequados.

c) Deformação causada por choques, movimentações, colocação de umidade, expulsão inadequada dos produtos, etc.

d) Contraração que não pagarem os serviços autorizados pela Dona empresa.

e) Danos decorrentes de transportar, desenvolver natural, bem como ecolado do peso sobre a produto.`);
  
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('Arial');
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    try {
      // Here you would typically save to database
      // For now, just show success message
      toast({
        title: "Contrato salvo com sucesso",
        description: "O conteúdo do contrato foi salvo.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o contrato.",
        variant: "destructive",
      });
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-100/40">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Editar documento</h1>
        </div>

        {/* Editor Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-4 border-b border-slate-200 flex-wrap">
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-3 py-1 rounded border border-slate-300 text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
            </select>

            <select 
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="px-3 py-1 rounded border border-slate-300 text-sm w-16"
            >
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="24">24</option>
            </select>

            <div className="h-6 w-px bg-slate-300 mx-2"></div>

            <button
              onClick={() => formatText('bold')}
              className="p-2 rounded hover:bg-slate-100 transition-colors"
              title="Negrito"
            >
              <Bold className="h-4 w-4" />
            </button>

            <button
              onClick={() => formatText('italic')}
              className="p-2 rounded hover:bg-slate-100 transition-colors"
              title="Itálico"
            >
              <Italic className="h-4 w-4" />
            </button>

            <button
              onClick={() => formatText('underline')}
              className="p-2 rounded hover:bg-slate-100 transition-colors"
              title="Sublinhado"
            >
              <Underline className="h-4 w-4" />
            </button>

            <div className="h-6 w-px bg-slate-300 mx-2"></div>

            <button
              onClick={() => formatText('justifyLeft')}
              className="p-2 rounded hover:bg-slate-100 transition-colors"
              title="Alinhar à esquerda"
            >
              <AlignLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => formatText('justifyCenter')}
              className="p-2 rounded hover:bg-slate-100 transition-colors"
              title="Centralizar"
            >
              <AlignCenter className="h-4 w-4" />
            </button>

            <button
              onClick={() => formatText('justifyRight')}
              className="p-2 rounded hover:bg-slate-100 transition-colors"
              title="Alinhar à direita"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>

          {/* Editor */}
          <div className="p-6">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[500px] w-full p-4 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              style={{ 
                fontFamily: fontFamily,
                fontSize: fontSize + 'px',
                lineHeight: '1.6'
              }}
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 p-6 border-t border-slate-200 bg-slate-50/50">
            <Button
              variant="outline"
              onClick={onBack}
            >
              Voltar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoEditor;