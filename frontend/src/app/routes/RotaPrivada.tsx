import { Spinner } from "@/app/components/ui/Spinner";
import { useAuth } from "@/app/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";

export function RotaPrivada() {
  const location = useLocation();
  const { autenticado, carregandoUsuario } = useAuth();

  if (carregandoUsuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner texto="Carregando sessão..." />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
