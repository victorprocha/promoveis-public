
import { useState, useEffect } from 'react';
import { clientService } from '@/services/clientService';
import { Client, ClientFilters, ClientsResponse, CreateClientData, UpdateClientData } from '@/types/client';
import { LoadingState } from '@/types/common';
import { useToast } from '@/hooks/use-toast';

export const useClients = (filters: ClientFilters = {}) => {
  const [data, setData] = useState<ClientsResponse | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = async (newFilters?: ClientFilters) => {
    setLoading('loading');
    setError(null);
    
    try {
      const response = await clientService.getClients(newFilters || filters);
      setData(response);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
      setLoading('error');
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive",
      });
    }
  };

  const createClient = async (clientData: CreateClientData) => {
    try {
      const response = await clientService.createClient(clientData);
      toast({
        title: "Sucesso",
        description: response.message,
      });
      await fetchClients(); // Recarregar lista
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: UpdateClientData) => {
    try {
      const response = await clientService.updateClient(id, clientData);
      toast({
        title: "Sucesso",
        description: response.message,
      });
      await fetchClients(); // Recarregar lista
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const response = await clientService.deleteClient(id);
      toast({
        title: "Sucesso",
        description: response.message,
      });
      await fetchClients(); // Recarregar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover cliente';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    data,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    refetch: () => fetchClients()
  };
};

export const useClient = (id: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      setLoading('loading');
      setError(null);
      
      try {
        const response = await clientService.getClientById(id);
        setClient(response);
        setLoading('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar cliente');
        setLoading('error');
      }
    };

    fetchClient();
  }, [id]);

  return { client, loading, error };
};
