import { AuthContext } from "@/app/contexts/AuthContext";
import { useContext } from "react";

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return contexto;
}
