
export interface DadosConvertidos {
  cliente: {
    nome: string;
    email: string;
    telefone: string;
    numeroCliente: string;
    situacao: string;
    etapa: string;
  };
  resumoFinanceiro: {
    valorTotal: number;
    ipi: number;
    descontos: number;
    subtotal: number;
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
      categoria: string;
    }>;
  }>;
  projeto: {
    numero: string;
    data: string;
    prazoEntrega: string;
    observacoes: string;
  };
  rawXML: string;
  processedAt: string;
}

export const parseXMLToStructuredData = (xmlContent: string): DadosConvertidos => {
  console.log('[XMLParser] Processando XML para dados estruturados...');
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Verificar se há erros de parsing
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Erro ao fazer parse do XML: ' + parserError.textContent);
  }

  const dadosConvertidos: DadosConvertidos = {
    cliente: {
      nome: '',
      email: '',
      telefone: '',
      numeroCliente: '',
      situacao: '',
      etapa: ''
    },
    resumoFinanceiro: {
      valorTotal: 0,
      ipi: 0,
      descontos: 0,
      subtotal: 0
    },
    ambientes: [],
    projeto: {
      numero: '',
      data: '',
      prazoEntrega: '',
      observacoes: ''
    },
    rawXML: xmlContent,
    processedAt: new Date().toISOString()
  };

  try {
    // Extrair dados do cliente
    const clienteNode = xmlDoc.querySelector('cliente, Client, CLIENTE') ||
                       xmlDoc.querySelector('[nome], [name], [cliente]');
    
    if (clienteNode) {
      dadosConvertidos.cliente.nome = getTextContent(clienteNode, 'nome, name, cliente, razaoSocial') || '';
      dadosConvertidos.cliente.email = getTextContent(clienteNode, 'email, e-mail, EMAIL') || '';
      dadosConvertidos.cliente.telefone = getTextContent(clienteNode, 'telefone, phone, fone, tel') || '';
      dadosConvertidos.cliente.numeroCliente = getTextContent(clienteNode, 'codigo, id, numero, codigoCliente') || '';
      dadosConvertidos.cliente.situacao = getTextContent(clienteNode, 'situacao, status, estado') || '';
      dadosConvertidos.cliente.etapa = getTextContent(clienteNode, 'etapa, fase, stage') || '';
    }

    // Extrair dados do projeto
    const projetoNode = xmlDoc.querySelector('projeto, pedido, orcamento, Project') || xmlDoc.documentElement;
    if (projetoNode) {
      dadosConvertidos.projeto.numero = getTextContent(projetoNode, 'numero, numeroPedido, id, codigo') || '';
      dadosConvertidos.projeto.data = getTextContent(projetoNode, 'data, date, dataCriacao, created') || '';
      dadosConvertidos.projeto.prazoEntrega = getTextContent(projetoNode, 'prazoEntrega, dataEntrega, deadline') || '';
      dadosConvertidos.projeto.observacoes = getTextContent(projetoNode, 'observacoes, obs, comentarios, notes') || '';
    }

    // Extrair resumo financeiro
    let valorTotal = 0;
    let ipi = 0;
    let descontos = 0;

    // Buscar valores financeiros em vários locais possíveis
    const totalNodes = xmlDoc.querySelectorAll('total, valorTotal, TOTAL, grandTotal, valor');
    totalNodes.forEach(node => {
      const value = parseFloat(node.textContent || '0');
      if (!isNaN(value) && value > valorTotal) {
        valorTotal = value;
      }
    });

    const ipiNodes = xmlDoc.querySelectorAll('ipi, IPI, impostos');
    ipiNodes.forEach(node => {
      const value = parseFloat(node.textContent || '0');
      if (!isNaN(value)) {
        ipi += value;
      }
    });

    const descontoNodes = xmlDoc.querySelectorAll('desconto, descontos, discount');
    descontoNodes.forEach(node => {
      const value = parseFloat(node.textContent || '0');
      if (!isNaN(value)) {
        descontos += value;
      }
    });

    dadosConvertidos.resumoFinanceiro = {
      valorTotal,
      ipi,
      descontos,
      subtotal: valorTotal - descontos
    };

    // Extrair ambientes
    const ambientesNodes = xmlDoc.querySelectorAll('ambiente, room, espaco, local, Environment') ||
                          xmlDoc.querySelectorAll('item[tipo="ambiente"], [categoria="ambiente"]');

    ambientesNodes.forEach((ambienteNode, index) => {
      const ambiente = {
        id: getTextContent(ambienteNode, 'id, codigo') || `ambiente-${index + 1}`,
        descricao: getTextContent(ambienteNode, 'descricao, nome, name, description') || `Ambiente ${index + 1}`,
        valorAmbiente: 0,
        itens: [] as any[]
      };

      // Buscar itens do ambiente
      const itensNodes = ambienteNode.querySelectorAll('item, produto, product, Item');
      itensNodes.forEach((itemNode, itemIndex) => {
        const quantidade = parseFloat(getTextContent(itemNode, 'quantidade, qty, quantity') || '1');
        const precoUnitario = parseFloat(getTextContent(itemNode, 'precoUnitario, preco, price, valor') || '0');
        const precoTotal = quantidade * precoUnitario;

        const item = {
          codigo: getTextContent(itemNode, 'codigo, code, id, sku') || `ITEM-${itemIndex + 1}`,
          descricao: getTextContent(itemNode, 'descricao, nome, name, description') || `Item ${itemIndex + 1}`,
          quantidade,
          unidade: getTextContent(itemNode, 'unidade, unit, medida') || 'UN',
          precoUnitario,
          precoTotal,
          categoria: getTextContent(itemNode, 'categoria, category, tipo, group') || 'Diversos'
        };

        ambiente.itens.push(item);
        ambiente.valorAmbiente += precoTotal;
      });

      dadosConvertidos.ambientes.push(ambiente);
    });

    // Se não encontrou ambientes estruturados, tentar extrair produtos diretamente
    if (dadosConvertidos.ambientes.length === 0) {
      const produtosNodes = xmlDoc.querySelectorAll('produto, item, product, Item');
      
      if (produtosNodes.length > 0) {
        const ambienteGenerico = {
          id: 'ambiente-geral',
          descricao: 'Produtos Gerais',
          valorAmbiente: 0,
          itens: [] as any[]
        };

        produtosNodes.forEach((produtoNode, index) => {
          const quantidade = parseFloat(getTextContent(produtoNode, 'quantidade, qty, quantity') || '1');
          const precoUnitario = parseFloat(getTextContent(produtoNode, 'precoUnitario, preco, price, valor') || '0');
          const precoTotal = quantidade * precoUnitario;

          const produto = {
            codigo: getTextContent(produtoNode, 'codigo, code, id, sku') || `PROD-${index + 1}`,
            descricao: getTextContent(produtoNode, 'descricao, nome, name, description') || `Produto ${index + 1}`,
            quantidade,
            unidade: getTextContent(produtoNode, 'unidade, unit, medida') || 'UN',
            precoUnitario,
            precoTotal,
            categoria: getTextContent(produtoNode, 'categoria, category, tipo, group') || 'Diversos'
          };

          ambienteGenerico.itens.push(produto);
          ambienteGenerico.valorAmbiente += precoTotal;
        });

        dadosConvertidos.ambientes.push(ambienteGenerico);
      }
    }

    // Calcular total dos ambientes se não foi encontrado no XML
    if (dadosConvertidos.resumoFinanceiro.valorTotal === 0) {
      dadosConvertidos.resumoFinanceiro.valorTotal = dadosConvertidos.ambientes.reduce(
        (total, ambiente) => total + ambiente.valorAmbiente, 0
      );
      dadosConvertidos.resumoFinanceiro.subtotal = dadosConvertidos.resumoFinanceiro.valorTotal - dadosConvertidos.resumoFinanceiro.descontos;
    }

    console.log('[XMLParser] Dados convertidos com sucesso:', dadosConvertidos);
    return dadosConvertidos;

  } catch (error) {
    console.error('[XMLParser] Erro ao processar XML:', error);
    throw new Error('Erro ao processar XML: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
  }
};

// Função auxiliar para buscar texto em múltiplos seletores
const getTextContent = (parent: Element, selectors: string): string => {
  const selectorList = selectors.split(',').map(s => s.trim());
  
  for (const selector of selectorList) {
    const element = parent.querySelector(selector);
    if (element && element.textContent?.trim()) {
      return element.textContent.trim();
    }
    
    // Tentar como atributo também
    const attribute = parent.getAttribute(selector);
    if (attribute?.trim()) {
      return attribute.trim();
    }
  }
  
  return '';
};

// Manter função existente para compatibilidade
export const parseXMLToProducts = (xmlContent: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  const products = [];
  const items = xmlDoc.querySelectorAll('item, produto, product');
  
  items.forEach((item, index) => {
    const product = {
      id: `temp-${index}`,
      codigo: item.querySelector('codigo, code, id')?.textContent || `PROD-${index + 1}`,
      descricao: item.querySelector('descricao, description, name')?.textContent || `Produto ${index + 1}`,
      quantidade: parseFloat(item.querySelector('quantidade, qty, quantity')?.textContent || '1'),
      unidade: item.querySelector('unidade, unit')?.textContent || 'CH',
      altura_metros: parseFloat(item.querySelector('altura, height')?.textContent || '0'),
      largura_metros: parseFloat(item.querySelector('largura, width')?.textContent || '0'),
      preco_unitario: parseFloat(item.querySelector('precoUnitario, unitPrice, price')?.textContent || '0'),
    };
    products.push(product);
  });

  return products;
};
