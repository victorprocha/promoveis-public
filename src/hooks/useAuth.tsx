
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { User, LoginCredentials, SignupCredentials } from '@/types/auth';
import { LoadingState } from '@/types/common';

interface AuthContextType {
  user: User | null;
  loading: LoadingState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>('loading');

  useEffect(() => {
    // Verificar se há usuário logado ao inicializar
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading('idle');
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading('loading');
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setLoading('success');
    } catch (error) {
      setLoading('error');
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setLoading('loading');
    try {
      const response = await authService.signup(credentials);
      setUser(response.data.user);
      setLoading('success');
    } catch (error) {
      setLoading('error');
      throw error;
    }
  };

  const logout = async () => {
    setLoading('loading');
    try {
      await authService.logout();
      setUser(null);
      setLoading('success');
    } catch (error) {
      setLoading('error');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
