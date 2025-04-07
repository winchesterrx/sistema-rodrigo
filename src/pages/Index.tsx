
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Gerencial de Contratos
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de gerenciamento e controle de contratos
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-lg px-8"
          >
            Login
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/cadastro")}
            className="text-lg px-8"
          >
            Cadastrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
