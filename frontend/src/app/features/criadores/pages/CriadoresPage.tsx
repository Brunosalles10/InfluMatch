import { EmptyState } from "@/app/components/feedback/EmptyState";
import { ErrorState } from "@/app/components/feedback/ErrorState";
import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Spinner } from "@/app/components/ui/Spinner";
import { useColetaYoutube } from "@/app/hooks/useColetaYoutube";
import {
  filtroRankingInfluenciadoresSchema,
  type DadosFiltroRankingInfluenciadores,
} from "@/app/schemas";
import { rankingsService } from "@/app/services/rankings/rankingsService";
import { obterTermoColetaYoutube } from "@/app/utils/coletaYoutube";
import { validarComSchema } from "@/app/utils/validacao";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { CriadoresFiltros } from "../components/CriadoresFiltros";
import { CriadoresMobileList } from "../components/CriadoresMobileList";
import { CriadoresRankingTable } from "../components/CriadoresRankingTable";
import { RankingPagination } from "../components/RankingPagination";
import { ConstrutorFiltrosCriadores } from "../utils/ConstrutorFiltrosCriadores";
import { calcularTotalPaginas } from "../utils/criadores.helpers";

export function CriadoresPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { coletarPorTermo, coletando } = useColetaYoutube();

  const filtrosUrl = useMemo(() => {
    return ConstrutorFiltrosCriadores.extrairFiltrosDaUrl(searchParams);
  }, [searchParams]);

  const resultadoValidacao = useMemo(() => {
    return validarComSchema(filtroRankingInfluenciadoresSchema, filtrosUrl);
  }, [filtrosUrl]);

  const filtrosValidados = resultadoValidacao.sucesso
    ? resultadoValidacao.dados
    : null;

  const filtrosConsulta = filtrosValidados ?? {
    page: 1,
    limit: 10,
    ordenarPor: "engajamento" as const,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["ranking-influenciadores", filtrosConsulta],
    queryFn: () =>
      rankingsService.buscarRankingInfluenciadores(filtrosConsulta),
    enabled: Boolean(filtrosValidados),
  });

  const criadores = data?.data ?? [];
  const totalPaginas = calcularTotalPaginas(data);

  function aplicarFiltros(filtros: DadosFiltroRankingInfluenciadores) {
    setSearchParams(
      ConstrutorFiltrosCriadores.criarSearchParams({
        ...filtros,
        page: 1,
        limit: filtros.limit ?? filtrosValidados?.limit ?? 10,
      }),
    );
  }

  /**
   * Coleta dados no YouTube e atualiza a consulta com a plataforma correta.
   */
  async function buscarNoYoutube(
    filtros: DadosFiltroRankingInfluenciadores,
  ): Promise<void> {
    const termo = obterTermoColetaYoutube({
      busca: filtros.busca,
      nicho: filtros.nicho,
    });

    const coletaConcluida = await coletarPorTermo(termo);

    if (!coletaConcluida) {
      return;
    }

    aplicarFiltros({
      ...filtros,
      plataforma: "YOUTUBE",
    });
  }

  function limparFiltros() {
    setSearchParams(
      ConstrutorFiltrosCriadores.criarSearchParams({
        page: 1,
        limit: 10,
        ordenarPor: "engajamento",
      }),
    );
  }

  function alterarPagina(pagina: number) {
    if (!filtrosValidados) {
      return;
    }

    setSearchParams(
      ConstrutorFiltrosCriadores.criarSearchParams({
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
          titulo="Ranking de Criadores"
          descricao="Encontre influenciadores por plataforma, nicho e métricas de performance."
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
        titulo="Ranking de Criadores"
        descricao="Encontre influenciadores por plataforma, nicho e métricas de performance."
      />

      <CriadoresFiltros
        key={searchParams.toString()}
        filtrosAtuais={filtrosValidados}
        carregandoBuscaYoutube={coletando}
        aoAplicarFiltros={aplicarFiltros}
        aoBuscarNoYoutube={buscarNoYoutube}
        aoLimparFiltros={limparFiltros}
      />

      {isLoading && (
        <div className="rounded-2xl border border-border bg-surface/70 p-10">
          <Spinner texto="Carregando ranking de criadores..." />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          titulo="Erro ao carregar ranking"
          descricao="Não foi possível buscar os criadores agora. Verifique sua conexão ou tente novamente."
          tentarNovamente={() => refetch()}
        />
      )}

      {!isLoading && !isError && criadores.length === 0 && (
        <EmptyState
          titulo="Nenhum criador encontrado"
          descricao="Tente alterar os filtros ou execute uma coleta do YouTube no painel administrativo."
          acaoTexto="Limpar filtros"
          onAcao={limparFiltros}
        />
      )}

      {!isLoading && !isError && criadores.length > 0 && (
        <>
          <CriadoresRankingTable
            criadores={criadores}
            page={filtrosValidados.page}
            limit={filtrosValidados.limit}
          />

          <CriadoresMobileList
            criadores={criadores}
            page={filtrosValidados.page}
            limit={filtrosValidados.limit}
          />

          <RankingPagination
            paginaAtual={filtrosValidados.page}
            totalPaginas={totalPaginas}
            aoAlterarPagina={alterarPagina}
          />
        </>
      )}
    </PageContainer>
  );
}
