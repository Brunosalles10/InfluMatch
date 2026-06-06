import { Spinner } from "@/app/components/ui/Spinner";
import { useAuth } from "@/app/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

export function RotaAdmin() {
  const { autenticado, carregandoUsuario, usuarioAdmin } = useAuth();

  if (carregandoUsuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner texto="Verificando permissões..." />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (!usuarioAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
