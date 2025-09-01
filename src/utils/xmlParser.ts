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

// Interface for the XML Preview Dialog
export interface XMLStructure {
  type: 'promob' | 'traditional' | 'unknown';
  hasCustomerData: boolean;
  hasItemsData: boolean;
  hasBudgetData: boolean;
  sections: PromobSection[];
}

export interface PromobSection {
  name: string;
  data: Array<{
    id: string;
    value: string;
  }>;
}

// Internal interface for processing
interface InternalXMLStructure {
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

interface InternalPromobSection {
  descricao: string;
  itens: any[];
}

const analyzeXMLStructure = (xmlContent: string): InternalXMLStructure => {
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

  const promobSections: InternalPromobSection[] = [];
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

// New function to analyze XML for preview
export const analyzeXMLForPreview = (xmlContent: string): XMLStructure => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

  // Check for different XML structures
  const hasPromobStructure = xmlDoc.querySelector('CUSTOMERSDATA, ITEMSDATA, BUDGETDATA') !== null;
  const hasTraditionalStructure = xmlDoc.querySelector('DadosCliente, Projeto, ResumoFinanceiro') !== null;

  let type: 'promob' | 'traditional' | 'unknown' = 'unknown';
  if (hasPromobStructure) type = 'promob';
  else if (hasTraditionalStructure) type = 'traditional';

  const hasCustomerData = xmlDoc.querySelector('DadosCliente, CUSTOMERSDATA') !== null;
  const hasItemsData = xmlDoc.querySelector('ITEMSDATA, produto, item') !== null;
  const hasBudgetData = xmlDoc.querySelector('BUDGETDATA, ResumoFinanceiro') !== null;

  const sections: PromobSection[] = [];

  if (type === 'promob') {
    // Extract Promob sections
    const customerData = xmlDoc.querySelector('CUSTOMERSDATA');
    if (customerData) {
      const customers = customerData.querySelectorAll('CUSTOMER');
      const customerItems = Array.from(customers).map((customer, index) => ({
        id: customer.getAttribute('id') || `customer-${index}`,
        value: customer.textContent || `Cliente ${index + 1}`
      }));
      
      if (customerItems.length > 0) {
        sections.push({
          name: 'CUSTOMERSDATA',
          data: customerItems
        });
      }
    }

    const itemsData = xmlDoc.querySelector('ITEMSDATA');
    if (itemsData) {
      const items = itemsData.querySelectorAll('ITEM');
      const itemItems = Array.from(items).map((item, index) => ({
        id: item.getAttribute('id') || `item-${index}`,
        value: item.textContent || `Item ${index + 1}`
      }));
      
      if (itemItems.length > 0) {
        sections.push({
          name: 'ITEMSDATA',
          data: itemItems
        });
      }
    }

    const budgetData = xmlDoc.querySelector('BUDGETDATA');
    if (budgetData) {
      const budgets = budgetData.querySelectorAll('BUDGET');
      const budgetItems = Array.from(budgets).map((budget, index) => ({
        id: budget.getAttribute('id') || `budget-${index}`,
        value: budget.textContent || `Orçamento ${index + 1}`
      }));
      
      if (budgetItems.length > 0) {
        sections.push({
          name: 'BUDGETDATA',
          data: budgetItems
        });
      }
    }
  } else if (type === 'traditional') {
    // Extract traditional XML sections
    const produtos = xmlDoc.querySelectorAll('produto, item');
    if (produtos.length > 0) {
      const productItems = Array.from(produtos).map((produto, index) => ({
        id: produto.querySelector('codigo')?.textContent || `prod-${index}`,
        value: produto.querySelector('descricao')?.textContent || `Produto ${index + 1}`
      }));
      
      sections.push({
        name: 'ITEMSDATA',
        data: productItems
      });
    }
  }

  return {
    type,
    hasCustomerData,
    hasItemsData,
    hasBudgetData,
    sections
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
