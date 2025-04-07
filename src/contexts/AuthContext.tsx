import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { 
    name: string; 
    cpf: string; 
    isAdmin?: boolean;
    permissions?: string[];
  } | null;
  login: (cpf: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ 
    name: string; 
    cpf: string; 
    isAdmin?: boolean;
    permissions?: string[];
  } | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (cpf: string, password: string): Promise<boolean> => {
    const formattedCPF = cpf.replace(/\D/g, '');
    console.log("Tentando login com:", { formattedCPF, password });

    try {
      const { data: foundUser, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('cpf', formattedCPF)
        .single();

      console.log("Resultado do Supabase:", { foundUser, error });

      if (error) {
        console.error("Erro ao buscar usuário:", error);
        return false;
      }

      if (!foundUser) {
        console.warn("Usuário não encontrado com CPF:", formattedCPF);
        return false;
      }

      if (foundUser.senha !== password) {
        console.warn("Senha incorreta. Digitada:", password, "Esperada:", foundUser.senha);
        return false;
      }

      const userData = { 
        name: foundUser.nome, 
        cpf: foundUser.cpf,
        isAdmin: foundUser.is_admin,
        permissions: foundUser.permissions 
      };

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;

    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.isAdmin) return true;

    if (user.cpf.replace(/\D/g, '') === '22251193847') {
      if (!user.permissions) return false;
      if (["create", "edit", "delete", "view"].includes(permission)) {
        return user.permissions.includes(permission) || user.permissions.includes("all");
      }
    }

    if (!user.permissions) return false;
    return user.permissions.includes(permission) || user.permissions.includes("all");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      hasPermission: checkPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
