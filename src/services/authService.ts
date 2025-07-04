
import { supabase } from '@/integrations/supabase/client';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/types/auth';
import { ApiResponse } from '@/types/common';

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Falha na autenticação');
      }

      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Usuário',
        email: data.user.email || '',
        role: 'user',
        createdAt: data.user.created_at
      };

      const authData: AuthResponse = {
        user,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token
      };

      return {
        data: authData,
        message: 'Login realizado com sucesso',
        success: true
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  async signup(credentials: SignupCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: credentials.name
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Falha no cadastro');
      }

      const user: User = {
        id: data.user.id,
        name: credentials.name,
        email: credentials.email,
        role: 'user',
        createdAt: data.user.created_at
      };

      // Se houver sessão (confirmação de email desabilitada)
      const authData: AuthResponse = {
        user,
        token: data.session?.access_token || '',
        refreshToken: data.session?.refresh_token || ''
      };

      return {
        data: authData,
        message: data.session ? 'Conta criada com sucesso' : 'Conta criada! Verifique seu email para confirmar.',
        success: true
      };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  getCurrentUser(): User | null {
    try {
      const session = supabase.auth.getSession();
      // Como getSession é async, vamos usar uma abordagem diferente
      return null; // Será atualizado pelo hook useAuth
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    try {
      // Verificação simples - será complementada pelo hook useAuth
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }
};
