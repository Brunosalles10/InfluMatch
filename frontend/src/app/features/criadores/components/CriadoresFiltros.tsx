import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Video } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import {
  filtroRankingInfluenciadoresSchema,
  type DadosFiltroRankingInfluenciadores,
  type EntradaFiltroRankingInfluenciadores,
} from "@/app/schemas";

type CriadoresFiltrosProps = {
  filtrosAtuais: DadosFiltroRankingInfluenciadores;
  carregandoBuscaYoutube: boolean;
  aoAplicarFiltros: (filtros: DadosFiltroRankingInfluenciadores) => void;
  aoBuscarNoYoutube: (
    filtros: DadosFiltroRankingInfluenciadores,
  ) => Promise<void>;
  aoLimparFiltros: () => void;
};

const opcoesPlataforma = [
  { label: "Todas as plataformas", value: "" },
  { label: "YouTube", value: "YOUTUBE" },
  { label: "Instagram", value: "INSTAGRAM" },
  { label: "TikTok", value: "TIKTOK" },
];

const opcoesOrdenacao = [
  { label: "Seguidores", value: "seguidores" },
  { label: "Visualizações", value: "visualizacoes" },
  { label: "Conteúdos", value: "conteudos" },
  { label: "Engajamento", value: "engajamento" },
];

/**
 * Exibe os filtros do banco e a ação explícita de busca no YouTube.
 */
export function CriadoresFiltros({
  filtrosAtuais,
  carregandoBuscaYoutube,
  aoAplicarFiltros,
  aoBuscarNoYoutube,
  aoLimparFiltros,
}: CriadoresFiltrosProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    EntradaFiltroRankingInfluenciadores,
    unknown,
    DadosFiltroRankingInfluenciadores
  >({
    resolver: zodResolver(filtroRankingInfluenciadoresSchema),
    defaultValues: {
      busca: filtrosAtuais.busca ?? "",
      nicho: filtrosAtuais.nicho ?? "",
      plataforma: filtrosAtuais.plataforma ?? "",
      ordenarPor: filtrosAtuais.ordenarPor ?? "engajamento",
      page: filtrosAtuais.page,
      limit: filtrosAtuais.limit,
    },
  });

  /**
   * Aplica os filtros consultando somente os dados do banco.
   */
  function enviarFormulario(dados: DadosFiltroRankingInfluenciadores) {
    aoAplicarFiltros(prepararFiltros(dados));
  }

  /**
   * Solicita uma coleta no YouTube usando os filtros preenchidos.
   */
  async function buscarNoYoutube(
    dados: DadosFiltroRankingInfluenciadores,
  ): Promise<void> {
    await aoBuscarNoYoutube(prepararFiltros(dados));
  }

  /**
   * Reinicia a paginação ao executar uma nova pesquisa.
   */
  function prepararFiltros(
    dados: DadosFiltroRankingInfluenciadores,
  ): DadosFiltroRankingInfluenciadores {
    return {
      ...dados,
      page: 1,
      limit: filtrosAtuais.limit,
    };
  }

  return (
    <form
      onSubmit={handleSubmit(enviarFormulario)}
      className="rounded-2xl border border-border bg-surface/80 p-4 shadow-card"
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_180px_180px_180px]">
        <Input
          placeholder="Buscar por nome ou @username..."
          erro={errors.busca?.message}
          iconeEsquerda={<Search className="h-5 w-5" />}
          {...register("busca")}
        />

        <Input
          placeholder="Nicho"
          erro={errors.nicho?.message}
          {...register("nicho")}
        />

        <Select
          opcoes={opcoesPlataforma}
          erro={errors.plataforma?.message}
          {...register("plataforma")}
        />

        <Select
          opcoes={opcoesOrdenacao}
          erro={errors.ordenarPor?.message}
          {...register("ordenarPor")}
        />
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variante="outline" onClick={aoLimparFiltros}>
          Limpar
        </Button>

        <Button
          type="submit"
          carregando={isSubmitting && !carregandoBuscaYoutube}
        >
          Filtrar
        </Button>

        <Button
          type="button"
          variante="secondary"
          iconeEsquerda={<Video className="h-5 w-5" />}
          carregando={carregandoBuscaYoutube}
          onClick={handleSubmit(buscarNoYoutube)}
        >
          Buscar no YouTube
        </Button>
      </div>
    </form>
  );
}
