import { EmptyState } from "@/app/components/feedback/EmptyState";
import { ErrorState } from "@/app/components/feedback/ErrorState";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Button } from "@/app/components/ui/Button";
import { Spinner } from "@/app/components/ui/Spinner";
import { rankingsService } from "@/app/services/rankings/rankingsService";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { CreatorPreviewCard } from "./CreatorPreviewCard";

export function CriadoresEmAltaSection() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["home", "criadores-em-alta"],
    queryFn: () =>
      rankingsService.buscarRankingInfluenciadores({
        plataforma: "YOUTUBE",
        ordenarPor: "engajamento",
        page: 1,
        limit: 3,
      }),
  });

  const criadores = data?.data ?? [];

  return (
    <section>
      <SectionHeader
        titulo="Criadores em Alta"
        descricao="Influenciadores com destaque por engajamento e relevância no nicho."
        acao={
          <Link to="/criadores">
            <Button variante="outline">Ver ranking completo</Button>
          </Link>
        }
      />

      {isLoading && (
        <div className="rounded-2xl border border-border bg-surface/60 p-10">
          <Spinner texto="Carregando criadores em alta..." />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          titulo="Erro ao carregar criadores"
          descricao="Não foi possível buscar os criadores em alta agora."
          tentarNovamente={() => refetch()}
        />
      )}

      {!isLoading && !isError && criadores.length === 0 && (
        <EmptyState
          titulo="Nenhum criador encontrado"
          descricao="Execute uma coleta no painel administrativo ou ajuste os filtros depois."
        />
      )}

      {!isLoading && !isError && criadores.length > 0 && (
        <div className="grid gap-5 md:grid-cols-3">
          {criadores.map((criador, index) => (
            <CreatorPreviewCard
              key={criador.id}
              criador={criador}
              posicao={index + 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
