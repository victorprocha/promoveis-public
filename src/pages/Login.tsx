
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordDialog from '@/components/Dialogs/ForgotPasswordDialog';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular validação de login
    setTimeout(() => {
      if (user === 'admin' && password === '123456') {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao FoccoLojas",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha inválidos.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handlePromobLogin = () => {
    toast({
      title: "Autenticação Promob",
      description: "Funcionalidade de login via Promob em desenvolvimento.",
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Coluna Esquerda - Promocional */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-[#00AEEF] to-[#0088CC] relative overflow-hidden">
        {/* Elementos gráficos de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-white rounded-full opacity-50"></div>
          <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,120 C150,60 350,0 600,60 C850,120 1050,60 1200,120 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"/>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full">
          {/* Imagem ilustrativa */}
          <div className="mb-8">
            <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <div className="w-48 h-48 bg-white/30 rounded-full flex items-center justify-center">
                <div className="text-6xl">👨‍💼</div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Ainda não é cliente FOCCO<span className="text-[#BED730]">LOJAS</span>?
          </h1>
          
          <p className="text-xl text-white mb-8 max-w-md">
            Conheça agora nossa solução e descomplique sua gestão!
          </p>

          <Button
            onClick={() => window.open('https://foccolojas.com.br', '_blank')}
            className="bg-[#BED730] hover:bg-[#A8C625] text-white font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          >
            Acessar site
          </Button>
        </div>

        {/* Link do rodapé */}
        <div className="absolute bottom-4 left-6">
          <a 
            href="https://foccolojas.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/70 text-sm hover:text-white transition-colors"
          >
            https://foccolojas.com.br
          </a>
        </div>
      </div>

      {/* Coluna Direita - Formulário */}
      <div className="w-full lg:w-2/5 bg-white flex flex-col justify-center px-8 lg:px-12">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2A3F54]">
              FOCCO<span className="text-[#007BFF]">LOJAS</span>
            </h1>
          </div>

          {/* Boas-vindas */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Seja bem-vindo(a)!</h2>
            <p className="text-gray-600">Utilize seu usuário e senha para acessar o sistema.</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="user" className="text-gray-700 font-medium">User</Label>
              <Input
                id="user"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Digite seu usuário"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Lembrar-me
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#BED730] hover:bg-[#A8C625] text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300"
            >
              {isLoading ? "Entrando..." : "LOG INTO"}
            </Button>

            <div className="text-right">
              <ForgotPasswordDialog>
                <button type="button" className="text-sm text-[#007BFF] hover:underline">
                  Alterar senha
                </button>
              </ForgotPasswordDialog>
            </div>
          </form>

          {/* Divisor */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">Ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Botão Promob */}
          <Button
            onClick={handlePromobLogin}
            variant="outline"
            className="w-full mb-4 py-3 border-gray-300 hover:bg-gray-50"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 bg-[#FF6B35] rounded flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <span className="text-gray-700">PROMOB</span>
            </div>
          </Button>

          {/* Links de recuperação */}
          <div className="text-center mb-6">
            <span className="text-sm text-gray-600">Esqueceu usuário ou senha? </span>
            <ForgotPasswordDialog>
              <button className="text-sm text-[#007BFF] hover:underline">
                Recuperar acesso
              </button>
            </ForgotPasswordDialog>
          </div>

          {/* Botões das lojas */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => window.open('#', '_blank')}
              className="flex-1 bg-black text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm">📱 App Store</span>
            </button>
            <button
              onClick={() => window.open('#', '_blank')}
              className="flex-1 bg-black text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm">📱 Google Play</span>
            </button>
          </div>

          {/* Link final */}
          <div className="text-center">
            <span className="text-sm text-gray-600">Ainda não é cliente? </span>
            <a
              href="https://foccolojas.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#007BFF] hover:underline"
            >
              Acesse o site do FoccoLOJAS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
