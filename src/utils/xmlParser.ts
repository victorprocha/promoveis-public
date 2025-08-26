
export interface PromobDataItem {
  id: string;
  value: string;
}

export interface PromobSection {
  name: string;
  data: PromobDataItem[];
}

export interface XMLStructure {
  type: 'promob' | 'traditional' | 'unknown';
  sections: PromobSection[];
  hasCustomerData: boolean;
  hasItemsData: boolean;
  hasBudgetData: boolean;
}

export const analyzeXMLStructure = (xmlContent: string): XMLStructure => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  console.log('[XML Parser] Analisando estrutura do XML...');
  
  // Verificar se é erro de parsing
  if (xmlDoc.documentElement.nodeName === 'parsererror') {
    console.error('[XML Parser] Erro ao fazer parse do XML');
    return {
      type: 'unknown',
      sections: [],
      hasCustomerData: false,
      hasItemsData: false,
      hasBudgetData: false
    };
  }

  // Buscar por estrutura Promob (DATA elements)
  const dataElements = xmlDoc.querySelectorAll('DATA');
  const customerDataSection = xmlDoc.querySelector('CUSTOMERSDATA');
  const itemsDataSection = xmlDoc.querySelector('ITEMSDATA');
  const budgetDataSection = xmlDoc.querySelector('BUDGETDATA');

  console.log(`[XML Parser] Encontrados ${dataElements.length} elementos DATA`);
  console.log(`[XML Parser] CUSTOMERSDATA: ${customerDataSection ? 'Sim' : 'Não'}`);
  console.log(`[XML Parser] ITEMSDATA: ${itemsDataSection ? 'Sim' : 'Não'}`);
  console.log(`[XML Parser] BUDGETDATA: ${budgetDataSection ? 'Sim' : 'Não'}`);

  const sections: PromobSection[] = [];

  if (dataElements.length > 0) {
    // Estrutura Promob detectada
    console.log('[XML Parser] Estrutura Promob detectada');

    // Extrair CUSTOMERSDATA
    if (customerDataSection) {
      const customerData = Array.from(customerDataSection.querySelectorAll('DATA')).map(element => ({
        id: element.getAttribute('ID') || '',
        value: element.getAttribute('VALUE') || ''
      }));
      sections.push({
        name: 'CUSTOMERSDATA',
        data: customerData
      });
      console.log(`[XML Parser] CUSTOMERSDATA: ${customerData.length} itens`);
    }

    // Extrair ITEMSDATA
    if (itemsDataSection) {
      const itemsData = Array.from(itemsDataSection.querySelectorAll('DATA')).map(element => ({
        id: element.getAttribute('ID') || '',
        value: element.getAttribute('VALUE') || ''
      }));
      sections.push({
        name: 'ITEMSDATA',
        data: itemsData
      });
      console.log(`[XML Parser] ITEMSDATA: ${itemsData.length} itens`);
    }

    // Extrair BUDGETDATA
    if (budgetDataSection) {
      const budgetData = Array.from(budgetDataSection.querySelectorAll('DATA')).map(element => ({
        id: element.getAttribute('ID') || '',
        value: element.getAttribute('VALUE') || ''
      }));
      sections.push({
        name: 'BUDGETDATA',
        data: budgetData
      });
      console.log(`[XML Parser] BUDGETDATA: ${budgetData.length} itens`);
    }

    return {
      type: 'promob',
      sections,
      hasCustomerData: !!customerDataSection,
      hasItemsData: !!itemsDataSection,
      hasBudgetData: !!budgetDataSection
    };
  }

  // Verificar estrutura tradicional
  const ambienteElements = xmlDoc.querySelectorAll('ambiente, Ambiente, AMBIENTE');
  const itemElements = xmlDoc.querySelectorAll('item, Item, ITEM');
  
  if (ambienteElements.length > 0 || itemElements.length > 0) {
    console.log('[XML Parser] Estrutura tradicional detectada');
    return {
      type: 'traditional',
      sections: [],
      hasCustomerData: false,
      hasItemsData: itemElements.length > 0,
      hasBudgetData: false
    };
  }

  console.log('[XML Parser] Estrutura desconhecida');
  return {
    type: 'unknown',
    sections: [],
    hasCustomerData: false,
    hasItemsData: false,
    hasBudgetData: false
  };
};

export const extractPromobData = (xmlStructure: XMLStructure): any => {
  if (xmlStructure.type !== 'promob') {
    console.warn('[XML Parser] Tentando extrair dados Promob de estrutura não-Promob');
    return null;
  }

  const customerSection = xmlStructure.sections.find(s => s.name === 'CUSTOMERSDATA');
  const itemsSection = xmlStructure.sections.find(s => s.name === 'ITEMSDATA');
  const budgetSection = xmlStructure.sections.find(s => s.name === 'BUDGETDATA');

  // Extrair dados do cliente e ambiente
  const getDataValue = (section: PromobSection | undefined, id: string): string => {
    return section?.data.find(item => item.id === id)?.value || '';
  };

  if (!customerSection) {
    console.warn('[XML Parser] Seção CUSTOMERSDATA não encontrada');
    return null;
  }

  const environmentName = getDataValue(customerSection, 'Environment');
  const clientName = getDataValue(customerSection, 'nomecliente') || getDataValue(customerSection, 'corporateName');
  const clientEmail = getDataValue(customerSection, 'email');
  const situation = getDataValue(customerSection, 'Situation');
  const stage = getDataValue(customerSection, 'Stage');

  console.log(`[XML Parser] Ambiente extraído: "${environmentName}"`);
  console.log(`[XML Parser] Cliente extraído: "${clientName}"`);
  console.log(`[XML Parser] Situação: "${situation}"`);
  console.log(`[XML Parser] Etapa: "${stage}"`);

  if (!environmentName) {
    console.warn('[XML Parser] Ambiente não encontrado nos dados do cliente');
    return null;
  }

  // Estrutura de dados compatível com o sistema atual
  const parsedData = {
    orcamento: {
      data_orcamento: new Date().toISOString().split('T')[0],
      ambiente_principal: environmentName,
      situacao: situation || 'Importado',
      etapa: stage || 'Análise',
      valor_pedido: 0,
      valor_orcamento: 0,
      acrescimo: 0,
      frete: 0,
      montagem: 0,
      impostos: 0,
      descontos: 0,
    },
    ambientes: [{
      descricao: environmentName,
      total_pedido: 0,
      total_orcamento: 0,
    }],
    categorias: [{
      descricao: 'Categoria Principal',
      total_pedido: 0,
      total_orcamento: 0,
      ambiente_index: 0,
    }],
    itens: [],
    subitens: [],
    margens: []
  };

  // Extrair itens se disponível
  if (itemsSection && itemsSection.data.length > 0) {
    // Para agora, criar um item genérico baseado no ambiente
    parsedData.itens.push({
      descricao: `Móveis de ${environmentName}`,
      referencia: '',
      quantidade: 1,
      unidade: 'UN',
      largura: 0,
      altura: 0,
      profundidade: 0,
      dimensoes: '0x0x0',
      valor_total: 0,
      categoria_index: 0,
    });
  }

  return parsedData;
};
