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
  hasTotalPrices: boolean;
  hasAmbients: boolean;
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
      hasBudgetData: false,
      hasTotalPrices: false,
      hasAmbients: false
    };
  }

  // Buscar por estrutura Promob (DATA elements)
  const dataElements = xmlDoc.querySelectorAll('DATA');
  const customerDataSection = xmlDoc.querySelector('CUSTOMERSDATA');
  const itemsDataSection = xmlDoc.querySelector('ITEMSDATA');
  const budgetDataSection = xmlDoc.querySelector('BUDGETDATA');
  const totalPricesSection = xmlDoc.querySelector('TOTALPRICES');
  const ambientsSection = xmlDoc.querySelector('AMBIENTS');

  console.log(`[XML Parser] Encontrados ${dataElements.length} elementos DATA`);
  console.log(`[XML Parser] CUSTOMERSDATA: ${customerDataSection ? 'Sim' : 'Não'}`);
  console.log(`[XML Parser] ITEMSDATA: ${itemsDataSection ? 'Sim' : 'Não'}`);
  console.log(`[XML Parser] BUDGETDATA: ${budgetDataSection ? 'Sim' : 'Não'}`);
  console.log(`[XML Parser] TOTALPRICES: ${totalPricesSection ? 'Sim' : 'Não'}`);
  console.log(`[XML Parser] AMBIENTS: ${ambientsSection ? 'Sim' : 'Não'}`);

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

    // Extrair TOTALPRICES
    if (totalPricesSection) {
      const totalPricesData = [];
      
      // Valor total da tabela
      const tableValue = totalPricesSection.getAttribute('TABLE');
      if (tableValue) {
        totalPricesData.push({
          id: 'TABLE_VALUE',
          value: tableValue
        });
      }

      // Extrair margens de ORDER
      const orderElement = totalPricesSection.querySelector('MARGINS ORDER');
      if (orderElement) {
        const orderValue = orderElement.getAttribute('VALUE');
        if (orderValue) {
          totalPricesData.push({
            id: 'ORDER_VALUE',
            value: orderValue
          });
        }

        // Margens específicas de ORDER
        const orderMargins = orderElement.querySelectorAll('MARGIN');
        orderMargins.forEach(margin => {
          const id = margin.getAttribute('ID');
          const value = margin.getAttribute('VALUE');
          if (id && value) {
            totalPricesData.push({
              id: `ORDER_${id.toUpperCase()}`,
              value: value
            });
          }
        });
      }

      // Extrair margens de BUDGET
      const budgetElement = totalPricesSection.querySelector('MARGINS BUDGET');
      if (budgetElement) {
        const budgetValue = budgetElement.getAttribute('VALUE');
        if (budgetValue) {
          totalPricesData.push({
            id: 'BUDGET_VALUE',
            value: budgetValue
          });
        }

        // Margens específicas de BUDGET
        const budgetMargins = budgetElement.querySelectorAll('MARGIN');
        budgetMargins.forEach(margin => {
          const id = margin.getAttribute('ID');
          const value = margin.getAttribute('VALUE');
          if (id && value) {
            totalPricesData.push({
              id: `BUDGET_${id.toUpperCase()}`,
              value: value
            });
          }
        });
      }

      sections.push({
        name: 'TOTALPRICES',
        data: totalPricesData
      });
      console.log(`[XML Parser] TOTALPRICES: ${totalPricesData.length} itens`);
    }

    // Extrair AMBIENTS
    if (ambientsSection) {
      const ambientsData = [];
      const ambientElements = ambientsSection.querySelectorAll('AMBIENT');
      
      ambientElements.forEach((ambient, ambientIndex) => {
        const description = ambient.getAttribute('DESCRIPTION');
        const totalPrices = ambient.querySelector('TOTALPRICES');
        const tableValue = totalPrices?.getAttribute('TABLE');
        
        if (description) {
          ambientsData.push({
            id: `AMBIENT_${ambientIndex}_DESCRIPTION`,
            value: description
          });
        }
        
        if (tableValue) {
          ambientsData.push({
            id: `AMBIENT_${ambientIndex}_TABLE`,
            value: tableValue
          });
        }
        
        // Extrair categorias do ambiente
        const categories = ambient.querySelectorAll('CATEGORIES CATEGORY');
        categories.forEach((category, categoryIndex) => {
          const categoryDescription = category.getAttribute('DESCRIPTION');
          const categoryTotalPrices = category.querySelector('TOTALPRICES');
          const categoryTableValue = categoryTotalPrices?.getAttribute('TABLE');
          
          if (categoryDescription) {
            ambientsData.push({
              id: `AMBIENT_${ambientIndex}_CATEGORY_${categoryIndex}_DESCRIPTION`,
              value: categoryDescription
            });
          }
          
          if (categoryTableValue) {
            ambientsData.push({
              id: `AMBIENT_${ambientIndex}_CATEGORY_${categoryIndex}_TABLE`,
              value: categoryTableValue
            });
          }
          
          // Extrair itens da categoria
          const items = category.querySelectorAll('ITEM');
          items.forEach((item, itemIndex) => {
            const itemData = {
              description: item.getAttribute('DESCRIPTION'),
              reference: item.getAttribute('REFERENCE'),
              unit: item.getAttribute('UNIT'),
              quantity: item.getAttribute('QUANTITY'),
              width: item.getAttribute('WIDTH'),
              height: item.getAttribute('HEIGHT'),
              depth: item.getAttribute('DEPTH'),
              textDimension: item.getAttribute('TEXTDIMENSION'),
            };
            
            const priceElement = item.querySelector('PRICE');
            const totalComponents = priceElement?.getAttribute('TOTALCOMPONENTS');
            
            // Adicionar dados do item
            Object.entries(itemData).forEach(([key, value]) => {
              if (value) {
                ambientsData.push({
                  id: `AMBIENT_${ambientIndex}_CATEGORY_${categoryIndex}_ITEM_${itemIndex}_${key.toUpperCase()}`,
                  value: value
                });
              }
            });
            
            if (totalComponents) {
              ambientsData.push({
                id: `AMBIENT_${ambientIndex}_CATEGORY_${categoryIndex}_ITEM_${itemIndex}_TOTALCOMPONENTS`,
                value: totalComponents
              });
            }
          });
        });
      });
      
      sections.push({
        name: 'AMBIENTS',
        data: ambientsData
      });
      console.log(`[XML Parser] AMBIENTS: ${ambientsData.length} itens`);
    }

    return {
      type: 'promob',
      sections,
      hasCustomerData: !!customerDataSection,
      hasItemsData: !!itemsDataSection,
      hasBudgetData: !!budgetDataSection,
      hasTotalPrices: !!totalPricesSection,
      hasAmbients: !!ambientsSection
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
      hasBudgetData: false,
      hasTotalPrices: false,
      hasAmbients: false
    };
  }

  console.log('[XML Parser] Estrutura desconhecida');
  return {
    type: 'unknown',
    sections: [],
    hasCustomerData: false,
    hasItemsData: false,
    hasBudgetData: false,
    hasTotalPrices: false,
    hasAmbients: false
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
  const totalPricesSection = xmlStructure.sections.find(s => s.name === 'TOTALPRICES');
  const ambientsSection = xmlStructure.sections.find(s => s.name === 'AMBIENTS');

  // Extrair dados do cliente conforme mapeamento fornecido
  const getDataValue = (section: PromobSection | undefined, id: string): string => {
    return section?.data.find(item => item.id === id)?.value || '';
  };

  const getNumericValue = (section: PromobSection | undefined, id: string): number => {
    const value = getDataValue(section, id);
    return parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
  };

  if (!customerSection) {
    console.warn('[XML Parser] Seção CUSTOMERSDATA não encontrada');
    return null;
  }

  // Extrair dados conforme o mapeamento XPath fornecido
  const nomeCliente = getDataValue(customerSection, 'nomecliente');
  const razaoSocial = getDataValue(customerSection, 'corporateName');
  const email = getDataValue(customerSection, 'email');
  const emailAlternativo = getDataValue(customerSection, 'email_Private_0');
  const telefoneCompleto = getDataValue(customerSection, 'phone_Mobile_0');
  const celular = getDataValue(customerSection, 'celular');
  const environmentName = getDataValue(customerSection, 'Environment');
  const situation = getDataValue(customerSection, 'Situation');
  const stage = getDataValue(customerSection, 'Stage');
  const createdOn = getDataValue(customerSection, 'CreatedOn');

  console.log(`[XML Parser] Nome do Cliente: "${nomeCliente}"`);
  console.log(`[XML Parser] Razão Social: "${razaoSocial}"`);
  console.log(`[XML Parser] Email: "${email}"`);
  console.log(`[XML Parser] Email Alternativo: "${emailAlternativo}"`);
  console.log(`[XML Parser] Telefone: "${telefoneCompleto}"`);
  console.log(`[XML Parser] Celular: "${celular}"`);
  console.log(`[XML Parser] Ambiente: "${environmentName}"`);
  console.log(`[XML Parser] Situação: "${situation}"`);
  console.log(`[XML Parser] Etapa: "${stage}"`);
  console.log(`[XML Parser] Data de Criação: "${createdOn}"`);

  if (!environmentName) {
    console.warn('[XML Parser] Ambiente não encontrado nos dados do cliente');
    return null;
  }

  // Extrair totais do orçamento
  let valorPedido = 0;
  let valorOrcamento = 0;
  let acrescimo = 0;
  let frete = 0;
  let montagem = 0;
  let impostos = 0;
  let descontos = 0;

  if (totalPricesSection) {
    // Valor pedido (ORDER)
    valorPedido = getNumericValue(totalPricesSection, 'ORDER_VALUE');
    
    // Valor orçamento (BUDGET)
    valorOrcamento = getNumericValue(totalPricesSection, 'BUDGET_VALUE');
    
    // Acréscimo
    acrescimo = getNumericValue(totalPricesSection, 'BUDGET_ACRESCIMO') || 
                getNumericValue(totalPricesSection, 'ORDER_ACR_1');
    
    // Frete
    frete = getNumericValue(totalPricesSection, 'BUDGET_FRETE');
    
    // Montagem
    montagem = getNumericValue(totalPricesSection, 'BUDGET_MONTAGEM');
    
    // Impostos (ICMS + IPI)
    const icms = getNumericValue(totalPricesSection, 'ORDER_ICMS');
    const ipi = getNumericValue(totalPricesSection, 'ORDER_IPI');
    impostos = icms + ipi;
    
    // Descontos (somar todos os descontos)
    const desc1 = getNumericValue(totalPricesSection, 'ORDER_DESC_1');
    const desc2 = getNumericValue(totalPricesSection, 'ORDER_DESC_2');
    const desc3 = getNumericValue(totalPricesSection, 'ORDER_DESC_3');
    const desc4 = getNumericValue(totalPricesSection, 'ORDER_DESC_4');
    descontos = desc1 + desc2 + desc3 + desc4;

    console.log(`[XML Parser] Valor Pedido: R$ ${valorPedido}`);
    console.log(`[XML Parser] Valor Orçamento: R$ ${valorOrcamento}`);
    console.log(`[XML Parser] Acréscimo: R$ ${acrescimo}`);
    console.log(`[XML Parser] Frete: R$ ${frete}`);
    console.log(`[XML Parser] Montagem: R$ ${montagem}`);
    console.log(`[XML Parser] Impostos: R$ ${impostos}`);
    console.log(`[XML Parser] Descontos: R$ ${descontos}`);
  }

  // Converter data de criação para formato adequado
  let dataOrcamento = new Date().toISOString().split('T')[0];
  if (createdOn) {
    try {
      // Formato esperado: "05/08/2025 14:48:44"
      const [datePart] = createdOn.split(' ');
      const [day, month, year] = datePart.split('/');
      dataOrcamento = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.warn('[XML Parser] Erro ao converter data de criação:', error);
    }
  }

  // Processar telefone (remover DDI se presente)
  let telefoneProcessado = celular || '';
  if (telefoneCompleto && telefoneCompleto.includes('|')) {
    telefoneProcessado = telefoneCompleto.split('|')[1] || telefoneProcessado;
  }

  // Extrair ambientes, categorias e itens da seção AMBIENTS
  const ambientes: any[] = [];
  const categorias: any[] = [];
  const itens: any[] = [];

  if (ambientsSection) {
    console.log(`[XML Parser] Processando dados de ambientes...`);
    
    // Agrupar dados por ambiente
    const ambientesMap = new Map();
    const categoriasMap = new Map();
    const itensMap = new Map();

    ambientsSection.data.forEach(dataItem => {
      const parts = dataItem.id.split('_');
      
      if (parts[0] === 'AMBIENT' && parts.length >= 3) {
        const ambientIndex = parseInt(parts[1]);
        
        if (parts[2] === 'DESCRIPTION') {
          // Descrição do ambiente
          ambientesMap.set(ambientIndex, {
            descricao: dataItem.value,
            total_pedido: 0,
            total_orcamento: 0,
          });
        } else if (parts[2] === 'TABLE') {
          // Valor total do ambiente
          const ambiente = ambientesMap.get(ambientIndex) || { descricao: `Ambiente ${ambientIndex}` };
          const valor = getNumericValue(ambientsSection, dataItem.id);
          ambiente.total_pedido = valor;
          ambiente.total_orcamento = valor;
          ambientesMap.set(ambientIndex, ambiente);
        } else if (parts[2] === 'CATEGORY' && parts.length >= 5) {
          const categoryIndex = parseInt(parts[3]);
          const categoryKey = `${ambientIndex}_${categoryIndex}`;
          
          if (parts[4] === 'DESCRIPTION') {
            // Descrição da categoria
            categoriasMap.set(categoryKey, {
              descricao: dataItem.value,
              total_pedido: 0,
              total_orcamento: 0,
              ambiente_index: ambientIndex,
            });
          } else if (parts[4] === 'TABLE') {
            // Valor total da categoria
            const categoria = categoriasMap.get(categoryKey) || { 
              descricao: `Categoria ${categoryIndex}`,
              ambiente_index: ambientIndex 
            };
            const valor = getNumericValue(ambientsSection, dataItem.id);
            categoria.total_pedido = valor;
            categoria.total_orcamento = valor;
            categoriasMap.set(categoryKey, categoria);
          } else if (parts[4] === 'ITEM' && parts.length >= 7) {
            const itemIndex = parseInt(parts[5]);
            const itemKey = `${ambientIndex}_${categoryIndex}_${itemIndex}`;
            const campo = parts[6];
            
            if (!itensMap.has(itemKey)) {
              itensMap.set(itemKey, {
                descricao: '',
                referencia: '',
                unidade: 'UN',
                quantidade: 1,
                largura: 0,
                altura: 0,
                profundidade: 0,
                dimensoes: '',
                valor_total: 0,
                categoria_index: categoryIndex,
              });
            }
            
            const item = itensMap.get(itemKey);
            
            switch (campo) {
              case 'DESCRIPTION':
                item.descricao = dataItem.value;
                break;
              case 'REFERENCE':
                item.referencia = dataItem.value;
                break;
              case 'UNIT':
                item.unidade = dataItem.value;
                break;
              case 'QUANTITY':
                item.quantidade = parseInt(dataItem.value) || 1;
                break;
              case 'WIDTH':
                item.largura = parseFloat(dataItem.value) || 0;
                break;
              case 'HEIGHT':
                item.altura = parseFloat(dataItem.value) || 0;
                break;
              case 'DEPTH':
                item.profundidade = parseFloat(dataItem.value) || 0;
                break;
              case 'TEXTDIMENSION':
                item.dimensoes = dataItem.value;
                break;
              case 'TOTALCOMPONENTS':
                item.valor_total = parseFloat(dataItem.value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
                break;
            }
          }
        }
      }
    });

    ambientes.push(...Array.from(ambientesMap.values()));
    categorias.push(...Array.from(categoriasMap.values()));
    itens.push(...Array.from(itensMap.values()));

    console.log(`[XML Parser] ${ambientes.length} ambientes processados`);
    console.log(`[XML Parser] ${categorias.length} categorias processadas`);
    console.log(`[XML Parser] ${itens.length} itens processados`);
  }

  // Se não há ambientes estruturados, usar dados básicos
  if (ambientes.length === 0) {
    ambientes.push({
      descricao: environmentName,
      total_pedido: valorPedido,
      total_orcamento: valorOrcamento || valorPedido,
    });
  }

  if (categorias.length === 0) {
    categorias.push({
      descricao: 'Categoria Principal',
      total_pedido: valorPedido,
      total_orcamento: valorOrcamento || valorPedido,
      ambiente_index: 0,
    });
  }

  // Se não há itens estruturados, processar da seção ITEMSDATA ou criar genérico
  if (itens.length === 0) {
    if (itemsSection && itemsSection.data.length > 0) {
      console.log(`[XML Parser] Processando ${itemsSection.data.length} itens da seção ITEMSDATA...`);
      
      // Agrupar dados por item (assumindo que itens podem ter múltiplos DATA elements)
      const itemsMap = new Map();
      
      itemsSection.data.forEach(dataItem => {
        // Usar o ID como base para agrupar itens relacionados
        const itemKey = dataItem.id.includes('_') ? dataItem.id.split('_')[0] : dataItem.id;
        
        if (!itemsMap.has(itemKey)) {
          itemsMap.set(itemKey, {
            descricao: `Item ${itemKey}`,
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
        
        // Mapear campos específicos se possível
        const item = itemsMap.get(itemKey);
        if (dataItem.id.toLowerCase().includes('descricao') || dataItem.id.toLowerCase().includes('description')) {
          item.descricao = dataItem.value;
        } else if (dataItem.id.toLowerCase().includes('quantidade') || dataItem.id.toLowerCase().includes('qty')) {
          item.quantidade = parseInt(dataItem.value) || 1;
        } else if (dataItem.id.toLowerCase().includes('valor') || dataItem.id.toLowerCase().includes('price')) {
          item.valor_total = parseFloat(dataItem.value) || 0;
        }
      });
      
      itens.push(...Array.from(itemsMap.values()));
      console.log(`[XML Parser] ${itens.length} itens processados da seção ITEMSDATA`);
    } else {
      // Criar um item genérico baseado no ambiente
      itens.push({
        descricao: `Móveis de ${environmentName}`,
        referencia: '',
        quantidade: 1,
        unidade: 'UN',
        largura: 0,
        altura: 0,
        profundidade: 0,
        dimensoes: '0x0x0',
        valor_total: valorOrcamento || valorPedido,
        categoria_index: 0,
      });
    }
  }

  // Estrutura de dados compatível com o sistema atual
  const parsedData = {
    orcamento: {
      data_orcamento: dataOrcamento,
      ambiente_principal: environmentName,
      situacao: situation || 'Importado',
      etapa: stage || 'Análise',
      valor_pedido: valorPedido,
      valor_orcamento: valorOrcamento || valorPedido,
      acrescimo: acrescimo,
      frete: frete,
      montagem: montagem,
      impostos: impostos,
      descontos: descontos,
    },
    cliente: {
      nome: nomeCliente || razaoSocial,
      razao_social: razaoSocial,
      email: email,
      email_alternativo: emailAlternativo,
      telefone: telefoneProcessado,
      telefone_completo: telefoneCompleto,
    },
    ambientes: ambientes,
    categorias: categorias,
    itens: itens,
    subitens: [],
    margens: []
  };

  return parsedData;
};
