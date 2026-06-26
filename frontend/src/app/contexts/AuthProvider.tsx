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

/**
 * Chave usada pelo TanStack Query para armazenar o usuário autenticado em cache.
 */
const CHAVE_QUERY_USUARIO = ["usuario-logado"] as const;

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Provider responsável por centralizar autenticação, usuário logado,
 * login, cadastro, logout e recarregamento do perfil.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
   * Verifica se existe token salvo antes de tentar buscar o perfil do usuário.
   */
  const possuiToken = existeTokenAutenticacao();

  /**
   * Busca o perfil do usuário logado quando existe token de autenticação.
   */
  const {
    data: usuario = null,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: CHAVE_QUERY_USUARIO,
    queryFn: () => usuariosService.buscarMeuPerfil(),
    enabled: possuiToken,
    retry: false,
  });

  /**
   * Indica se o provider ainda está carregando os dados do usuário autenticado.
   */
  const carregandoUsuario = possuiToken && (isLoading || isFetching);

  /**
   * Indica se existe usuário autenticado no contexto.
   */
  const autenticado = Boolean(usuario);

  /**
   * Indica se o usuário autenticado possui permissão administrativa.
   */
  const usuarioAdmin = usuario?.role === "ADMIN";

  /**
   * Remove token, dados locais de sessão e cache do usuário logado.
   */
  const limparSessao = useCallback(() => {
    authService.logout();

    queryClient.removeQueries({
      queryKey: CHAVE_QUERY_USUARIO,
    });
  }, [queryClient]);

  /**
   * Finaliza a sessão do usuário e redireciona para a tela de login.
   */
  const logout = useCallback(() => {
    limparSessao();

    toast.success("Logout realizado com sucesso.");
    navigate("/login", { replace: true });
  }, [limparSessao, navigate]);

  /**
   * Recarrega o perfil do usuário autenticado quando ainda existe token válido.
   */
  const recarregarPerfil = useCallback(async () => {
    if (!existeTokenAutenticacao()) {
      limparSessao();
      return;
    }

    await refetch();
  }, [limparSessao, refetch]);

  /**
   * Realiza login, salva o token pelo service, busca o perfil e redireciona.
   */
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

  /**
   * Realiza o cadastro do usuário e redireciona para a tela de login.
   */
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

  /**
   * Escuta o evento global de sessão expirada disparado pelo interceptor da API.
   */
  useEffect(() => {
    return ouvirEventoSessaoExpirada(() => {
      limparSessao();

      toast.error("Sua sessão expirou. Faça login novamente.");
      navigate("/login", { replace: true });
    });
  }, [limparSessao, navigate]);

  /**
   * Memoriza os dados e ações expostos pelo contexto de autenticação.
   */
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
