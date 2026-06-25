import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/app/hooks/useAuth";
import { ErroApi } from "@/app/services/api/ErroApi";
import { youtubeIntegracaoService } from "@/app/services/integracoes/youtubeIntegracaoService";
import type { ResumoColetaYoutube } from "@/app/types/youtube.types";

const QUANTIDADE_RESULTADOS_BUSCA = 10;

/**
 * Centraliza a coleta do YouTube usada pelas buscas comuns da aplicação.
 */
export function useColetaYoutube() {
  const queryClient = useQueryClient();
  const { autenticado } = useAuth();

  const coletaMutation = useMutation({
    mutationFn: executarColeta,
    onSuccess: tratarSucesso,
    onError: tratarErro,
  });

  /**
   * Executa a coleta somente quando há autenticação e um termo válido.
   */
  async function coletarPorTermo(termo?: string): Promise<boolean> {
    if (!autenticado) {
      toast.info("Faça login para buscar novos dados no YouTube.");
      return false;
    }

    const termoNormalizado = termo?.trim();

    if (!termoNormalizado) {
      toast.warning("Informe uma busca ou um nicho para consultar o YouTube.");
      return false;
    }

    try {
      await coletaMutation.mutateAsync(termoNormalizado);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Envia o termo ao endpoint existente de coleta.
   */
  function executarColeta(termo: string) {
    return youtubeIntegracaoService.coletarDados({
      nicho: termo,
      quantidadeResultados: QUANTIDADE_RESULTADOS_BUSCA,
    });
  }

  /**
   * Invalida os dados que podem ter sido alterados pela coleta.
   */
  async function tratarSucesso(resumo: ResumoColetaYoutube): Promise<void> {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["ranking-influenciadores"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["ranking-conteudos"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["home"],
      }),
    ]);

    const mensagem = resumo.retornadoDoCache
      ? "Dados coletados com sucesso."
      : "Novos dados coletados com sucesso.";

    toast.success(mensagem);
  }

  /**
   * Converte falhas da API em mensagens compreensíveis.
   */
  function tratarErro(erro: unknown): void {
    if (erro instanceof ErroApi) {
      toast.error(erro.message);
      return;
    }

    toast.error("Não foi possível buscar dados no YouTube.");
  }

  return {
    coletarPorTermo,
    coletando: coletaMutation.isPending,
  };
}
