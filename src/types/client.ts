
export interface Client {
  id: string;
  name: string;
  birthFoundation: string;
  type: 'Pessoa Física' | 'Pessoa Jurídica' | 'Prospect';
  phone: string;
  email: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  consultantId: string;
  consultantName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  type: 'Pessoa Física' | 'Pessoa Jurídica';
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  consultantId: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export interface ClientFilters {
  search?: string;
  type?: 'Pessoa Física' | 'Pessoa Jurídica' | 'Prospect';
  consultant?: string;
  page?: number;
  limit?: number;
}

export interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
