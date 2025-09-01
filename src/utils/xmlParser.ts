
export interface DadosConvertidos {
  cliente: {
    nome: string;
    email?: string;
    telefone?: string;
    numeroCliente?: string;
  };
  projeto: {
    numero?: string;
    descricao?: string;
    prazoEntrega?: string;
    observacoes?: string;
  };
  resumoFinanceiro: {
    valorTotal: number;
    ipi: number;
    descontos: number;
    frete?: number;
    montagem?: number;
  };
  ambientes: Array<{
    id: string;
    descricao: string;
    valorAmbiente: number;
    itens: Array<{
      codigo: string;
      descricao: string;
      quantidade: number;
      unidade: string;
      precoUnitario: number;
      precoTotal: number;
      dimensoes?: string;
    }>;
  }>;
  rawXML: string;
  processedAt: string;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface XMLStructure {
  cliente: {
    nome: string;
    email?: string;
    telefone?: string;
    numeroCliente?: string;
  };
  projeto: {
    numero?: string;
    descricao?: string;
    prazoEntrega?: string;
    observacoes?: string;
  };
  resumoFinanceiro: {
    valorTotal: number;
    ipi: number;
    descontos: number;
    frete?: number;
    montagem?: number;
  };
  ambientes: Array<{
    descricao: string;
    valorAmbiente: number;
    itens: Array<{
      codigo: string;
      descricao: string;
      quantidade: number;
      unidade: string;
      precoUnitario: number;
      precoTotal: number;
      dimensoes?: string;
    }>;
  }>;
}

export interface PromobSection {
  descricao: string;
  itens: any[];
}

const analyzeXMLStructure = (xmlContent: string): XMLStructure => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

  const clienteNome = xmlDoc.querySelector('DadosCliente nome')?.textContent || '';
  const clienteEmail = xmlDoc.querySelector('DadosCliente email')?.textContent || '';
  const clienteTelefone = xmlDoc.querySelector('DadosCliente telefone')?.textContent || '';
  const clienteNumeroCliente = xmlDoc.querySelector('DadosCliente numero_cliente')?.textContent || '';

  const projetoNumero = xmlDoc.querySelector('Projeto numero')?.textContent || '';
  const projetoDescricao = xmlDoc.querySelector('Projeto descricao')?.textContent || '';
  const projetoPrazoEntrega = xmlDoc.querySelector('Projeto prazo_entrega')?.textContent || '';
  const projetoObservacoes = xmlDoc.querySelector('Projeto observacoes')?.textContent || '';

  const valorTotal = parseFloat(xmlDoc.querySelector('ResumoFinanceiro total')?.textContent || '0');
  const ipi = parseFloat(xmlDoc.querySelector('ResumoFinanceiro ipi')?.textContent || '0');
  const descontos = parseFloat(xmlDoc.querySelector('ResumoFinanceiro descontos')?.textContent || '0');
  const frete = parseFloat(xmlDoc.querySelector('ResumoFinanceiro frete')?.textContent || '0');
  const montagem = parseFloat(xmlDoc.querySelector('ResumoFinanceiro montagem')?.textContent || '0');

  const promobSections: PromobSection[] = [];
  const secoes = xmlDoc.querySelectorAll('secao');
  secoes.forEach((secao) => {
    const descricao = secao.querySelector('descricao')?.textContent || '';
    const itens: any[] = [];
    const produtos = secao.querySelectorAll('produto');
    produtos.forEach((produto) => {
      const codigo = produto.querySelector('codigo')?.textContent || '';
      const descricao = produto.querySelector('descricao')?.textContent || '';
      const quantidade = parseFloat(produto.querySelector('quantidade')?.textContent || '0');
      const unidade = produto.querySelector('unidade')?.textContent || '';
      const precoUnitario = parseFloat(produto.querySelector('preco_unitario')?.textContent || '0');
      const precoTotal = parseFloat(produto.querySelector('preco_total')?.textContent || '0');
      const dimensoes = produto.querySelector('dimensoes')?.textContent || '';

      itens.push({
        codigo,
        descricao,
        quantidade,
        unidade,
        precoUnitario,
        precoTotal,
        dimensoes,
      });
    });

    promobSections.push({
      descricao,
      itens,
    });
  });

  const ambientes = promobSections.map((secao, index) => ({
    descricao: secao.descricao,
    valorAmbiente: secao.itens.reduce((total, item) => total + parseFloat(item.precoTotal || 0), 0),
    itens: secao.itens.map((item) => ({
      codigo: item.codigo,
      descricao: item.descricao,
      quantidade: item.quantidade,
      unidade: item.unidade,
      precoUnitario: item.precoUnitario,
      precoTotal: item.precoTotal,
      dimensoes: item.dimensoes,
    })),
  }));

  return {
    cliente: {
      nome: clienteNome,
      email: clienteEmail,
      telefone: clienteTelefone,
      numeroCliente: clienteNumeroCliente,
    },
    projeto: {
      numero: projetoNumero,
      descricao: projetoDescricao,
      prazoEntrega: projetoPrazoEntrega,
      observacoes: projetoObservacoes,
    },
    resumoFinanceiro: {
      valorTotal,
      ipi,
      descontos,
      frete,
      montagem,
    },
    ambientes: ambientes.map((ambiente, index) => ({
      descricao: ambiente.descricao,
      valorAmbiente: ambiente.valorAmbiente,
      itens: ambiente.itens.map((item) => ({
        codigo: item.codigo,
        descricao: item.descricao,
        quantidade: item.quantidade,
        unidade: item.unidade,
        precoUnitario: item.precoUnitario,
        precoTotal: item.precoTotal,
        dimensoes: item.dimensoes,
      })),
    })),
  };
};

export const parseXMLToStructuredData = (xmlContent: string): DadosConvertidos => {
  const structuredData = analyzeXMLStructure(xmlContent);

  // Generate unique IDs for environments
  const ambientesComId = structuredData.ambientes.map(ambiente => ({
    ...ambiente,
    id: Math.random().toString(36).substring(2, 15),
  }));

  return {
    cliente: structuredData.cliente,
    projeto: structuredData.projeto,
    resumoFinanceiro: structuredData.resumoFinanceiro,
    ambientes: ambientesComId,
    rawXML: xmlContent,
    processedAt: new Date().toISOString(),
  };
};
