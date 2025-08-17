import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value = '', onChange, placeholder, className }: RichTextEditorProps) => {
  const [editorValue, setEditorValue] = useState(value);
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
    
    // Reset cursor position
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
      action: () => insertFormatting('**', '**'),
      tooltip: 'Negrito'
    },
    { 
      icon: Italic, 
      action: () => insertFormatting('*', '*'),
      tooltip: 'Itálico'
    },
    { 
      icon: Underline, 
      action: () => insertFormatting('<u>', '</u>'),
      tooltip: 'Sublinhado'
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
      action: () => insertFormatting('\n<div style="text-align: left;">', '</div>'),
      tooltip: 'Alinhar à esquerda'
    },
    { 
      icon: AlignCenter, 
      action: () => insertFormatting('\n<div style="text-align: center;">', '</div>'),
      tooltip: 'Centralizar'
    },
    { 
      icon: AlignRight, 
      action: () => insertFormatting('\n<div style="text-align: right;">', '</div>'),
      tooltip: 'Alinhar à direita'
    }
  ];

  return (
    <div className={cn("border rounded-md overflow-hidden bg-background", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/20">
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
      </div>
      
      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={editorValue}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-32 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};