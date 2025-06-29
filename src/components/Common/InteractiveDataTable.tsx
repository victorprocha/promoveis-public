
import React from 'react';
import { MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  clickable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  emptyMessage?: string;
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
  onRowClick?: (item: any) => void;
  renderCustomActions?: (item: any) => React.ReactNode;
}

const InteractiveDataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  emptyMessage = "Nenhum item encontrado",
  onEdit,
  onView,
  onDelete,
  onRowClick,
  renderCustomActions
}) => {
  const handleRowClick = (item: any, event: React.MouseEvent) => {
    // Não disparar se o clique foi em um botão ou dropdown
    if ((event.target as HTMLElement).closest('button, [role="menuitem"]')) {
      return;
    }
    
    if (onRowClick) {
      onRowClick(item);
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📄</div>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr 
                key={index} 
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={(e) => handleRowClick(item, e)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.clickable && onRowClick ? (
                      <button 
                        className="text-[#007BFF] hover:text-[#0056b3] hover:underline font-medium text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick(item);
                        }}
                      >
                        {item[column.key]}
                      </button>
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderCustomActions ? (
                    renderCustomActions(item)
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(item); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InteractiveDataTable;
