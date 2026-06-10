import type { RespostaPaginada } from "@/app/types/api.types";

export function calcularPosicaoConteudo(
  indice: number,
  page?: number,
  limit?: number,
) {
  const paginaAtual = page ?? 1;
  const limiteAtual = limit ?? 10;

  return (paginaAtual - 1) * limiteAtual + indice + 1;
}

export function calcularTotalPaginas<T>(resposta?: RespostaPaginada<T>) {
  if (!resposta) {
    return 1;
  }

  if (resposta.totalPages) {
    return resposta.totalPages;
  }

  if (!resposta.total || !resposta.limit) {
    return 1;
  }

  return Math.max(1, Math.ceil(resposta.total / resposta.limit));
}

export function formatarDataPublicacao(data?: string | null) {
  if (!data) {
    return "Não disponível";
  }

  const dataPublicacao = new Date(data);

  if (Number.isNaN(dataPublicacao.getTime())) {
    return "Não disponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dataPublicacao);
}
