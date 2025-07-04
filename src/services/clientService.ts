import { supabase } from '@/integrations/supabase/client';
import { Client, CreateClientData, UpdateClientData, ClientFilters, ClientsResponse } from '@/types/client';
import { ApiResponse } from '@/types/common';

// Mapear tipo do banco para tipo da aplicação
const mapDatabaseToClient = (dbClient: any): Client => ({
  id: dbClient.id,
  name: dbClient.name,
  birthFoundation: dbClient.created_at ? new Date(dbClient.created_at).toLocaleDateString('pt-BR') : '',
  type: 'Pessoa Física', // Assumindo padrão, pode ser expandido
  phone: dbClient.phone || '',
  email: dbClient.email || '',
  company: dbClient.company,
  address: dbClient.address,
  city: dbClient.city,
  state: dbClient.state,
  zipCode: dbClient.zip_code,
  consultantId: dbClient.user_id,
  consultantName: 'Consultor Responsável', // Pode ser expandido para buscar o nome real
  createdAt: dbClient.created_at,
  updatedAt: dbClient.updated_at
});

export const clientService = {
  async getClients(filters: ClientFilters = {}): Promise<ClientsResponse> {
    try {
      let query = supabase
        .from('clients')
        .select('*');

      // Aplicar filtros
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      // Aplicar paginação
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit - 1;

      query = query.range(startIndex, endIndex);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const clients = data?.map(mapDatabaseToClient) || [];

      return {
        data: clients,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  async getClientById(id: string): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Cliente não encontrado');
      }

      return mapDatabaseToClient(data);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  },

  async createClient(clientData: CreateClientData): Promise<ApiResponse<Client>> {
    try {
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id, // Use the authenticated user's ID
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          zip_code: clientData.zipCode,
          notes: ''
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: mapDatabaseToClient(data),
        message: 'Cliente criado com sucesso',
        success: true
      };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  async updateClient(id: string, clientData: UpdateClientData): Promise<ApiResponse<Client>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          zip_code: clientData.zipCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: mapDatabaseToClient(data),
        message: 'Cliente atualizado com sucesso',
        success: true
      };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: undefined,
        message: 'Cliente removido com sucesso',
        success: true
      };
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      throw error;
    }
  }
};
