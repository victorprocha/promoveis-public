import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import DataTable from "@/components/Common/DataTable";
import { useProducts } from "@/hooks/useProducts";

interface EstoqueProps {
  onAddProduct: () => void;
  onViewHistory?: (productId: string) => void;
}

const Estoque: React.FC<EstoqueProps> = ({ onAddProduct, onViewHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, deleteProduct } = useProducts();

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
      sortable: true
    },
    {
      key: 'unidade',
      header: 'Unidade',
      sortable: true
    },
    {
      key: 'marca',
      header: 'Marca',
      sortable: true
    },
    {
      key: 'preco_compra',
      header: 'Preço',
      sortable: true,
      render: (value: number) => `R$ ${value.toFixed(2)}`
    },
    {
      key: 'estoque',
      header: 'Estoque',
      sortable: true
    },
    {
      key: 'estoque_minimo',
      header: 'Estoque Mínimo',
      sortable: true
    },
    {
      key: 'localizacao',
      header: 'Localização',
      sortable: true
    },
    {
      key: 'actions',
      header: 'Ações',
      sortable: false,
      render: (_: any, product: any) => (
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm"
            className="w-8 h-8 p-0 bg-success hover:bg-success/80 border-success"
            onClick={() => onViewHistory?.(product.id)}
          >
            <Plus className="w-4 h-4 text-white" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-8 h-8 p-0 bg-primary hover:bg-primary/80 border-primary"
          >
            <Search className="w-4 h-4 text-white" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => deleteProduct(product.id)}
          >
            <Plus className="w-4 h-4 rotate-45" />
          </Button>
        </div>
      )
    }
  ];

  const filteredProducts = products.filter(product =>
    product.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.marca && product.marca.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.fornecedor && product.fornecedor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <span>Home</span> &gt; <span>Estoqueeferência</span>
      </nav>

      {/* Header com botão adicionar */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={onAddProduct}
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquise pelo nome do produto, código, valor ou nome do fornecedor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="default" className="bg-primary text-white">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Seção Almoxarifado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded"></div>
            Almoxarifado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando produtos...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum Produto Cadastrado
            </div>
          ) : (
            <DataTable
              data={filteredProducts}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Estoque;