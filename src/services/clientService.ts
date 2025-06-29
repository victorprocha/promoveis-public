
import { Client, CreateClientData, UpdateClientData, ClientFilters, ClientsResponse } from '@/types/client';
import { ApiResponse } from '@/types/common';

// Mock data para simulação
const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    birthFoundation: '15/03/1985',
    type: 'Pessoa Física',
    phone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    consultantId: '1',
    consultantName: 'Maria Oliveira',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Empresa ABC Ltda',
    birthFoundation: '10/05/2010',
    type: 'Pessoa Jurídica',
    phone: '(11) 3333-4444',
    email: 'contato@empresaabc.com.br',
    company: 'Empresa ABC Ltda',
    consultantId: '2',
    consultantName: 'Carlos Santos',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    name: 'Ana Paula Ferreira',
    birthFoundation: '22/08/1992',
    type: 'Pessoa Física',
    phone: '(11) 88888-7777',
    email: 'ana.paula@email.com',
    consultantId: '3',
    consultantName: 'Roberto Lima',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    name: 'Tecnologia XYZ S.A.',
    birthFoundation: '03/12/2015',
    type: 'Pessoa Jurídica',
    phone: '(11) 2222-3333',
    email: 'contato@tecnologiaxyz.com.br',
    company: 'Tecnologia XYZ S.A.',
    consultantId: '1',
    consultantName: 'Maria Oliveira',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    name: 'Pedro Henrique Costa',
    birthFoundation: '07/11/1978',
    type: 'Pessoa Física',
    phone: '(11) 77777-6666',
    email: 'pedro.costa@email.com',
    consultantId: '4',
    consultantName: 'Fernanda Souza',
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z'
  }
];

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const clientService = {
  async getClients(filters: ClientFilters = {}): Promise<ClientsResponse> {
    await delay(800); // Simular delay da API

    let filteredClients = [...mockClients];

    // Aplicar filtros
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.consultantName.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.type) {
      filteredClients = filteredClients.filter(client => client.type === filters.type);
    }

    if (filters.consultant) {
      filteredClients = filteredClients.filter(client => 
        client.consultantName.toLowerCase().includes(filters.consultant!.toLowerCase())
      );
    }

    // Aplicar paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    return {
      data: paginatedClients,
      total: filteredClients.length,
      page,
      limit,
      totalPages: Math.ceil(filteredClients.length / limit)
    };
  },

  async getClientById(id: string): Promise<Client> {
    await delay(300);
    
    const client = mockClients.find(c => c.id === id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return client;
  },

  async createClient(data: CreateClientData): Promise<ApiResponse<Client>> {
    await delay(500);
    
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      company: data.company,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      birthFoundation: new Date().toLocaleDateString('pt-BR'),
      consultantId: data.consultantId,
      consultantName: 'Consultor Responsável', // Em produção, buscar pelo ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simular adição ao array (em produção seria salvo no backend)
    mockClients.unshift(newClient);

    return {
      data: newClient,
      message: 'Cliente criado com sucesso',
      success: true
    };
  },

  async updateClient(id: string, data: UpdateClientData): Promise<ApiResponse<Client>> {
    await delay(500);
    
    const clientIndex = mockClients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado');
    }

    const updatedClient = {
      ...mockClients[clientIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    mockClients[clientIndex] = updatedClient;

    return {
      data: updatedClient,
      message: 'Cliente atualizado com sucesso',
      success: true
    };
  },

  async deleteClient(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    
    const clientIndex = mockClients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado');
    }

    mockClients.splice(clientIndex, 1);

    return {
      data: undefined,
      message: 'Cliente removido com sucesso',
      success: true
    };
  }
};
