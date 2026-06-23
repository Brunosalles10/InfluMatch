import { EmptyState } from "@/app/components/feedback/EmptyState";
import { ErrorState } from "@/app/components/feedback/ErrorState";
import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Pagination } from "@/app/components/ui/Pagination";
import { Spinner } from "@/app/components/ui/Spinner";
import { useColetaYoutube } from "@/app/hooks/useColetaYoutube";
import {
  filtroRankingConteudosSchema,
  type DadosFiltroRankingConteudos,
} from "@/app/schemas";
import { rankingsService } from "@/app/services/rankings/rankingsService";
import { obterTermoColetaYoutube } from "@/app/utils/coletaYoutube";
import { validarComSchema } from "@/app/utils/validacao";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { ConteudosFiltros } from "../components/ConteudosFiltros";
import { ConteudosGrid } from "../components/ConteudosGrid";
import { ConstrutorFiltrosConteudos } from "../utils/ConstrutorFiltrosConteudos";
import { calcularTotalPaginas } from "../utils/conteudos.helpers";

export function VideosViraisPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { coletarPorTermo, coletando } = useColetaYoutube();

  const filtrosUrl = useMemo(() => {
    return ConstrutorFiltrosConteudos.extrairFiltrosDaUrl(searchParams);
  }, [searchParams]);

  const resultadoValidacao = useMemo(() => {
    return validarComSchema(filtroRankingConteudosSchema, filtrosUrl);
  }, [filtrosUrl]);

  const filtrosValidados = resultadoValidacao.sucesso
    ? resultadoValidacao.dados
    : null;

  const filtrosConsulta = filtrosValidados ?? {
    page: 1,
    limit: 10,
    plataforma: "YOUTUBE" as const,
    ordenarPor: "viral" as const,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["ranking-conteudos", filtrosConsulta],
    queryFn: () => rankingsService.buscarRankingConteudos(filtrosConsulta),
    enabled: Boolean(filtrosValidados),
  });

  const conteudos = data?.data ?? [];
  const totalPaginas = calcularTotalPaginas(data);

  function aplicarFiltros(filtros: DadosFiltroRankingConteudos) {
    setSearchParams(
      ConstrutorFiltrosConteudos.criarSearchParams({
        ...filtros,
        page: 1,
        limit: filtros.limit ?? filtrosValidados?.limit ?? 10,
      }),
    );
  }

  /**
   * Coleta vídeos do YouTube e atualiza os filtros após o processamento.
   */
  async function buscarNoYoutube(
    filtros: DadosFiltroRankingConteudos,
  ): Promise<void> {
    const termo = obterTermoColetaYoutube({
      busca: filtros.busca,
      nicho: filtros.nicho,
    });

    const coletaConcluida = await coletarPorTermo(termo);

    if (!coletaConcluida) {
      return;
    }

    aplicarFiltros(prepararFiltrosYoutube(filtros));
  }

  /**
   * Força a plataforma YouTube e remove tipos incompatíveis com ela.
   */
  function prepararFiltrosYoutube(
    filtros: DadosFiltroRankingConteudos,
  ): DadosFiltroRankingConteudos {
    const tipoConteudoValido =
      filtros.tipoConteudo === "VIDEO" || filtros.tipoConteudo === "SHORT";

    return {
      ...filtros,
      plataforma: "YOUTUBE",
      tipoConteudo: tipoConteudoValido ? filtros.tipoConteudo : undefined,
    };
  }

  function limparFiltros() {
    setSearchParams(
      ConstrutorFiltrosConteudos.criarSearchParams({
        page: 1,
        limit: 10,
        plataforma: "YOUTUBE",
        ordenarPor: "viral",
      }),
    );
  }

  function alterarPagina(pagina: number) {
    if (!filtrosValidados) {
      return;
    }

    setSearchParams(
      ConstrutorFiltrosConteudos.criarSearchParams({
        ...filtrosValidados,
        page: pagina,
      }),
    );
  }

  if (!filtrosValidados) {
    const descricaoErro = resultadoValidacao.sucesso
      ? "Os filtros informados são inválidos."
      : resultadoValidacao.erros.join(" ");

    return (
      <PageContainer className="space-y-8">
        <SectionHeader
          titulo="Ranking de Vídeos Virais"
          descricao="Descubra conteúdos com alto alcance, engajamento e potencial viral."
        />

        <ErrorState
          titulo="Filtros inválidos"
          descricao={descricaoErro}
          tentarNovamente={limparFiltros}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8">
      <SectionHeader
        titulo="Ranking de Vídeos Virais"
        descricao="Descubra conteúdos com alto alcance, engajamento e potencial viral."
      />

      <ConteudosFiltros
        key={searchParams.toString()}
        filtrosAtuais={filtrosValidados}
        carregandoBuscaYoutube={coletando}
        aoAplicarFiltros={aplicarFiltros}
        aoBuscarNoYoutube={buscarNoYoutube}
        aoLimparFiltros={limparFiltros}
      />

      {isLoading && (
        <div className="rounded-2xl border border-border bg-surface/70 p-10">
          <Spinner texto="Carregando vídeos virais..." />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          titulo="Erro ao carregar vídeos virais"
          descricao="Não foi possível buscar os conteúdos agora. Verifique sua conexão ou tente novamente."
          tentarNovamente={() => refetch()}
        />
      )}

      {!isLoading && !isError && conteudos.length === 0 && (
        <EmptyState
          titulo="Nenhum conteúdo encontrado"
          descricao="Tente alterar os filtros ou buscar novos dados diretamente no YouTube."
          acaoTexto="Limpar filtros"
          onAcao={limparFiltros}
        />
      )}

      {!isLoading && !isError && conteudos.length > 0 && (
        <>
          <ConteudosGrid
            conteudos={conteudos}
            page={filtrosValidados.page}
            limit={filtrosValidados.limit}
          />

          <Pagination
            paginaAtual={filtrosValidados.page}
            totalPaginas={totalPaginas}
            aoAlterarPagina={alterarPagina}
          />
        </>
      )}
    </PageContainer>
  );
}
