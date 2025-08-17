import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Table, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value = '', onChange, placeholder, className }: RichTextEditorProps) => {
  const [editorValue, setEditorValue] = useState(value);
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Verdana');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleValueChange = (newValue: string) => {
    setEditorValue(newValue);
    onChange?.(newValue);
  };

  const insertFormatting = (beforeText: string, afterText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorValue.substring(start, end);
    
    const newValue = 
      editorValue.substring(0, start) + 
      beforeText + 
      selectedText + 
      afterText + 
      editorValue.substring(end);
    
    handleValueChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + beforeText.length,
        start + beforeText.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    { 
      icon: Bold, 
      action: () => insertFormatting('<b>', '</b>'),
      tooltip: 'Negrito'
    },
    { 
      icon: Italic, 
      action: () => insertFormatting('<i>', '</i>'),
      tooltip: 'Itálico'
    },
    { 
      icon: Underline, 
      action: () => insertFormatting('<u>', '</u>'),
      tooltip: 'Sublinhado'
    },
    { 
      icon: Link, 
      action: () => insertFormatting('<a href="">', '</a>'),
      tooltip: 'Link'
    },
    { 
      icon: List, 
      action: () => insertFormatting('\n• '),
      tooltip: 'Lista com marcadores'
    },
    { 
      icon: ListOrdered, 
      action: () => insertFormatting('\n1. '),
      tooltip: 'Lista numerada'
    },
    { 
      icon: AlignLeft, 
      action: () => insertFormatting('<div align="left">', '</div>'),
      tooltip: 'Alinhar à esquerda'
    },
    { 
      icon: AlignCenter, 
      action: () => insertFormatting('<div align="center">', '</div>'),
      tooltip: 'Centralizar'
    },
    { 
      icon: AlignRight, 
      action: () => insertFormatting('<div align="right">', '</div>'),
      tooltip: 'Alinhar à direita'
    },
    { 
      icon: Table, 
      action: () => insertFormatting('<table><tr><td>', '</td></tr></table>'),
      tooltip: 'Tabela'
    }
  ];

  return (
    <div className={cn("border rounded-md overflow-hidden bg-background", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/20 flex-wrap">
        {formatButtons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              className="h-8 w-8 p-0 hover:bg-muted"
              title={button.tooltip}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          );
        })}
        
        {/* Font Family Selector */}
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Times">Times</SelectItem>
            <SelectItem value="Courier">Courier</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Font Size */}
        <Input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-16 h-8"
          min="8"
          max="72"
        />
        
        {/* Color picker placeholder */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted"
          title="Cor do texto"
        >
          <Type className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('+ ', '')}
          className="h-8 px-2 hover:bg-muted text-xs"
          title="Descrições rápidas"
        >
          + Descrições rápidas
        </Button>
      </div>
      
      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={editorValue}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-40 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{ fontFamily, fontSize: `${fontSize}px` }}
      />
    </div>
  );
};