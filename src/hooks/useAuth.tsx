
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, LoginCredentials, SignupCredentials } from '@/types/auth';
import { LoadingState } from '@/types/common';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: LoadingState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<LoadingState>('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email || '',
            role: 'user',
            createdAt: session.user.created_at
          };
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setLoading('idle');
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          role: 'user',
          createdAt: session.user.created_at
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading('idle');
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading('loading');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setLoading('error');
        throw new Error(error.message);
      }

      // O estado será atualizado pelo onAuthStateChange
      setLoading('success');
    } catch (error) {
      setLoading('error');
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setLoading('loading');
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
        setLoading('error');
        throw new Error(error.message);
      }

      // O estado será atualizado pelo onAuthStateChange
      setLoading('success');
    } catch (error) {
      setLoading('error');
      throw error;
    }
  };

  const logout = async () => {
    setLoading('loading');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setLoading('error');
        throw new Error(error.message);
      }
      
      // O estado será atualizado pelo onAuthStateChange
      setLoading('success');
    } catch (error) {
      setLoading('error');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    login,
    signup,
    logout,
    isAuthenticated
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
