
import React from 'react';
import { Edit, Eye, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Column {
  key: string;
  header: string;
}

interface InteractiveDataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage: string;
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const InteractiveDataTable: React.FC<InteractiveDataTableProps> = ({
  columns,
  data,
  emptyMessage,
  onEdit,
  onView,
  onDelete
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium">{emptyMessage}</p>
          <p className="text-slate-400 text-sm mt-1">Adicione novos itens para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            {columns.map((column) => (
              <TableHead key={column.key} className="font-semibold text-slate-700 py-4">
                {column.header}
              </TableHead>
            ))}
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all duration-200 border-b border-slate-100">
              {columns.map((column) => (
                <TableCell 
                  key={column.key} 
                  className="py-4 text-slate-600 font-medium cursor-pointer"
                  onClick={() => onView && onView(item)}
                >
                  {item[column.key]}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-xl">
                    {onView && (
                      <DropdownMenuItem 
                        onClick={() => onView(item)}
                        className="hover:bg-blue-50 text-blue-600 cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem 
                        onClick={() => onEdit(item)}
                        className="hover:bg-emerald-50 text-emerald-600 cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(item)}
                        className="hover:bg-red-50 text-red-600 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InteractiveDataTable;
