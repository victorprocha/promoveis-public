import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import DataTable from "@/components/Common/DataTable";

interface Product {
  id: string;
  codigo: string;
  nome: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  localizacao: string;
  marca: string;
}

interface EstoqueProps {
  onAddProduct: () => void;
}

const Estoque: React.FC<EstoqueProps> = ({ onAddProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - em uma aplicação real, isso viria do banco de dados
  const [products] = useState<Product[]>([
    // Array vazio inicialmente - "Nenhum Produto Cadastrado"
  ]);

  const columns = [
    {
      key: 'codigo',
      header: 'Código',
      sortable: true
    },
    {
      key: 'nome',
      header: 'Nome',
      sortable: true
    },
    {
      key: 'preco',
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
      key: 'estoqueMinimo',
      header: 'Estoque Mínimo',
      sortable: true
    },
    {
      key: 'localizacao',
      header: 'Localização',
      sortable: true
    },
    {
      key: 'marca',
      header: 'Marca',
      sortable: true
    },
    {
      key: 'actions',
      header: 'Ações',
      sortable: false,
      render: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Editar
          </Button>
          <Button variant="destructive" size="sm">
            Excluir
          </Button>
        </div>
      )
    }
  ];

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchQuery.toLowerCase())
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
          className="bg-success text-white hover:bg-success/90"
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
          {products.length === 0 ? (
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