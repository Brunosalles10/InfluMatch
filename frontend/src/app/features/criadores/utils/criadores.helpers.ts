import type { RespostaPaginada } from "@/app/services/types/api.types";

export function calcularPosicaoRanking(
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

export function obterTextoNaoDisponivel(valor?: string | number | null) {
  if (valor === undefined || valor === null || valor === "") {
    return "Não disponível";
  }

  return String(valor);
}
