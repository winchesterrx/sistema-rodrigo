
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { cpfMask } from "@/utils/validation";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    cpf: "",
    password: ""
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = cpfMask(e.target.value);
    setCpf(maskedValue);
    
    // Clear error when typing
    if (formErrors.cpf) {
      setFormErrors({ ...formErrors, cpf: "" });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      cpf: "",
      password: ""
    };
    let isValid = true;

    // CPF validation
    if (!cpf.trim()) {
      errors.cpf = "CPF é obrigatório";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Senha é obrigatória";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Format CPF to remove special characters
      const formattedCPF = cpf.replace(/\D/g, '');
      
      console.log("Login attempt with:", { formattedCPF, password });
      
      // Use auth context to login (now async)
      const success = await login(formattedCPF, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Você está sendo redirecionado para a página inicial.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Falha no login",
          description: "CPF ou senha incorretos. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-700">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com seu CPF e senha para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCPFChange}
                />
                {formErrors.cpf && (
                  <p className="text-sm text-red-500">{formErrors.cpf}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: "" });
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Entrar</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="px-0 text-sm text-gray-500 mt-2" asChild>
            <Link to="/">Voltar para o início</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
