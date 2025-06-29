
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/types/auth';
import { ApiResponse } from '@/types/common';

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'Usuário FoccoLojas',
  email: 'usuario@foccolojas.com',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00Z'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay(1000);

    // Simular validação simples
    if (credentials.email && credentials.password) {
      const authData: AuthResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Math.random().toString(36),
        refreshToken: 'mock-refresh-token-' + Math.random().toString(36)
      };

      // Armazenar token
      localStorage.setItem('auth_token', authData.token);
      localStorage.setItem('auth_user', JSON.stringify(authData.user));

      return {
        data: authData,
        message: 'Login realizado com sucesso',
        success: true
      };
    }

    throw new Error('Credenciais inválidas');
  },

  async signup(credentials: SignupCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay(1000);

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('As senhas não coincidem');
    }

    const newUser: User = {
      ...mockUser,
      name: credentials.name,
      email: credentials.email
    };

    const authData: AuthResponse = {
      user: newUser,
      token: 'mock-jwt-token-' + Math.random().toString(36),
      refreshToken: 'mock-refresh-token-' + Math.random().toString(36)
    };

    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('auth_user', JSON.stringify(authData.user));

    return {
      data: authData,
      message: 'Conta criada com sucesso',
      success: true
    };
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
};
