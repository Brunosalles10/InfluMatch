import { EmptyState } from "@/app/components/feedback/EmptyState";
import { ErrorState } from "@/app/components/feedback/ErrorState";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { Button } from "@/app/components/ui/Button";
import { Spinner } from "@/app/components/ui/Spinner";
import { rankingsService } from "@/app/services/rankings/rankingsService";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { ViralContentPreviewCard } from "./ViralContentPreviewCard";

export function ConteudosViraisSection() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["home", "conteudos-virais"],
    queryFn: () =>
      rankingsService.buscarRankingConteudos({
        plataforma: "YOUTUBE",
        ordenarPor: "viral",
        page: 1,
        limit: 3,
      }),
  });

  const conteudos = data?.data ?? [];

  return (
    <section>
      <SectionHeader
        titulo="Conteúdos Virais"
        descricao="Vídeos e shorts com maior potencial de alcance e engajamento."
        acao={
          <Link to="/videos-virais?plataforma=YOUTUBE">
            <Button variante="outline">Ver vídeos virais</Button>
          </Link>
        }
      />

      {isLoading && (
        <div className="rounded-2xl border border-border bg-surface/60 p-10">
          <Spinner texto="Carregando conteúdos virais..." />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          titulo="Erro ao carregar conteúdos"
          descricao="Não foi possível buscar os conteúdos virais agora."
          tentarNovamente={() => refetch()}
        />
      )}

      {!isLoading && !isError && conteudos.length === 0 && (
        <EmptyState
          titulo="Nenhum conteúdo viral encontrado"
          descricao="Execute uma coleta do YouTube no backend para alimentar os rankings."
        />
      )}

      {!isLoading && !isError && conteudos.length > 0 && (
        <div className="grid gap-5 md:grid-cols-3">
          {conteudos.map((conteudo, index) => (
            <ViralContentPreviewCard
              key={conteudo.id}
              conteudo={conteudo}
              posicao={index + 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
