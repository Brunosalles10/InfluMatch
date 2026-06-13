import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { AuthContext } from "@/app/contexts/AuthContext";
import {
  mapearCadastroParaDto,
  mapearLoginParaDto,
} from "@/app/mappers/auth.mapper";
import type { DadosCadastro, DadosLogin } from "@/app/schemas";
import { authService } from "@/app/services/auth/authService";
import { usuariosService } from "@/app/services/usuarios/usuariosService";
import { existeTokenAutenticacao } from "@/app/services/utils/authStorage";
import { ouvirEventoSessaoExpirada } from "@/app/utils/eventosAutenticacao";

const CHAVE_QUERY_USUARIO = ["usuario-logado"];

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: usuario = null,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: CHAVE_QUERY_USUARIO,
    queryFn: () => usuariosService.buscarMeuPerfil(),
    enabled: existeTokenAutenticacao(),
    retry: false,
  });

  const carregandoUsuario =
    existeTokenAutenticacao() && (isLoading || isFetching);

  const autenticado = Boolean(usuario);
  const usuarioAdmin = usuario?.role === "ADMIN";

  const limparSessao = useCallback(() => {
    authService.logout();
    queryClient.removeQueries({ queryKey: CHAVE_QUERY_USUARIO });
  }, [queryClient]);

  const logout = useCallback(() => {
    limparSessao();

    toast.success("Logout realizado com sucesso.");
    navigate("/login", { replace: true });
  }, [limparSessao, navigate]);

  const recarregarPerfil = useCallback(async () => {
    if (!existeTokenAutenticacao()) {
      limparSessao();
      return;
    }

    await refetch();
  }, [limparSessao, refetch]);

  const login = useCallback(
    async (dados: DadosLogin) => {
      await authService.login(mapearLoginParaDto(dados));

      await queryClient.fetchQuery({
        queryKey: CHAVE_QUERY_USUARIO,
        queryFn: () => usuariosService.buscarMeuPerfil(),
      });

      toast.success("Login realizado com sucesso.");
      navigate("/perfil", { replace: true });
    },
    [navigate, queryClient],
  );

  const cadastrar = useCallback(
    async (dados: DadosCadastro) => {
      await authService.cadastrar(mapearCadastroParaDto(dados));

      toast.success(
        "Cadastro realizado com sucesso. Faça login para continuar.",
      );
      navigate("/login", { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    return ouvirEventoSessaoExpirada(() => {
      limparSessao();

      toast.error("Sua sessão expirou. Faça login novamente.");
      navigate("/login", { replace: true });
    });
  }, [limparSessao, navigate]);

  const valor = useMemo(
    () => ({
      usuario,
      carregandoUsuario,
      autenticado,
      usuarioAdmin,
      login,
      cadastrar,
      logout,
      recarregarPerfil,
    }),
    [
      usuario,
      carregandoUsuario,
      autenticado,
      usuarioAdmin,
      login,
      cadastrar,
      logout,
      recarregarPerfil,
    ],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
