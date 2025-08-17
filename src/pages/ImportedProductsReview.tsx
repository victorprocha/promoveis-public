import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Edit2, Save, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface ImportedProduct {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  altura_metros: number;
  largura_metros: number;
  preco_unitario: number;
}

interface ImportedProductsReviewProps {
  products: ImportedProduct[];
  onBack: () => void;
  onConfirm: (products: ImportedProduct[]) => void;
}

export const ImportedProductsReview: React.FC<ImportedProductsReviewProps> = ({
  products: initialProducts,
  onBack,
  onConfirm,
}) => {
  const [products, setProducts] = useState<ImportedProduct[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ImportedProduct>>({});
  const { toast } = useToast();

  const handleEdit = (product: ImportedProduct) => {
    setEditingId(product.id);
    setEditData(product);
  };

  const handleSave = () => {
    if (!editingId) return;

    setProducts(products.map(product => 
      product.id === editingId 
        ? { ...product, ...editData }
        : product
    ));
    
    setEditingId(null);
    setEditData({});
    
    toast({
      title: "Sucesso",
      description: "Produto atualizado com sucesso!",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof ImportedProduct, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: field === 'quantidade' || field === 'altura_metros' || field === 'largura_metros' || field === 'preco_unitario'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleConfirm = () => {
    // Verifica se algum produto está sendo editado
    if (editingId) {
      toast({
        title: "Aviso",
        description: "Termine de editar o produto atual antes de confirmar.",
        variant: "destructive",
      });
      return;
    }

    onConfirm(products);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground"># Pedido de Compra</h1>
            <p className="text-sm text-muted-foreground">
              Verifique abaixo os dados referentes aos insumos importados através do xml da compra. 
              Caso contenha alguma informação incorreta você pode editar a informação do insumo.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleConfirm}
            className="bg-success hover:bg-success/90 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirmar
          </Button>
          <Button variant="outline">
            Voltar
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      <div className="mx-6 mt-4 p-3 bg-success/10 border border-success/20 rounded-md">
        <p className="text-sm text-success">
          Pedido de compra gerado com sucesso, verifique os produtos do pedido!
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Altura metros</TableHead>
                <TableHead>Largura metros</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className={product.id === editingId ? 'bg-blue-50' : ''}>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        value={editData.descricao || ''}
                        onChange={(e) => handleInputChange('descricao', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <div>
                        <div className="font-medium">{product.descricao}</div>
                        {product.codigo && (
                          <div className="text-sm text-muted-foreground">{product.codigo}</div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        value={editData.quantidade || ''}
                        onChange={(e) => handleInputChange('quantidade', e.target.value)}
                        className="w-20"
                      />
                    ) : (
                      product.quantidade
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        value={editData.unidade || ''}
                        onChange={(e) => handleInputChange('unidade', e.target.value)}
                        className="w-16"
                      />
                    ) : (
                      product.unidade
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.altura_metros || ''}
                        onChange={(e) => handleInputChange('altura_metros', e.target.value)}
                        className="w-20"
                      />
                    ) : (
                      `${product.altura_metros}m`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.largura_metros || ''}
                        onChange={(e) => handleInputChange('largura_metros', e.target.value)}
                        className="w-20"
                      />
                    ) : (
                      `${product.largura_metros}m`
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {editingId === product.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleSave}
                            className="text-success hover:text-success/80"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleCancel}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(product)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};