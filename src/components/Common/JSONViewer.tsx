
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface JSONViewerProps {
  data: any;
  title?: string;
  downloadFilename?: string;
}

interface JSONNodeProps {
  data: any;
  keyName?: string;
  level?: number;
}

const JSONNode: React.FC<JSONNodeProps> = ({ data, keyName, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  if (data === null) {
    return <span className="text-gray-500">null</span>;
  }

  if (data === undefined) {
    return <span className="text-gray-500">undefined</span>;
  }

  if (typeof data === 'string') {
    return <span className="text-green-600">"{data}"</span>;
  }

  if (typeof data === 'number') {
    return <span className="text-blue-600">{data}</span>;
  }

  if (typeof data === 'boolean') {
    return <span className="text-purple-600">{data.toString()}</span>;
  }

  if (Array.isArray(data)) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-gray-600">[{data.length}]</span>
        </button>
        {isExpanded && (
          <div className="ml-4 border-l border-gray-200 pl-4">
            {data.map((item, index) => (
              <div key={index} className="py-1">
                <span className="text-gray-500">{index}: </span>
                <JSONNode data={item} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-gray-600">{`{${keys.length}}`}</span>
        </button>
        {isExpanded && (
          <div className="ml-4 border-l border-gray-200 pl-4">
            {keys.map((key) => (
              <div key={key} className="py-1">
                <span className="text-blue-800 font-medium">"{key}": </span>
                <JSONNode data={data[key]} keyName={key} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span>{String(data)}</span>;
};

export const JSONViewer: React.FC<JSONViewerProps> = ({ 
  data, 
  title = "JSON Data",
  downloadFilename = "data.json"
}) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast({
        title: "Sucesso",
        description: "JSON copiado para a área de transferência!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar JSON.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Sucesso",
        description: "Arquivo JSON baixado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar arquivo JSON.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Baixar
          </Button>
        </div>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="font-mono text-sm">
          <JSONNode data={data} />
        </div>
      </div>
    </div>
  );
};
