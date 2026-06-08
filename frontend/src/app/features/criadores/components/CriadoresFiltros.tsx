import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
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
  aoAplicarFiltros: (filtros: DadosFiltroRankingInfluenciadores) => void;
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

export function CriadoresFiltros({
  filtrosAtuais,
  aoAplicarFiltros,
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

  function enviarFormulario(dados: DadosFiltroRankingInfluenciadores) {
    aoAplicarFiltros({
      ...dados,
      page: 1,
      limit: filtrosAtuais.limit,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(enviarFormulario)}
      className="rounded-2xl border border-border bg-surface/80 p-4 shadow-card"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px_auto_auto]">
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

        <Button type="submit" carregando={isSubmitting}>
          Filtrar
        </Button>

        <Button type="button" variante="outline" onClick={aoLimparFiltros}>
          Limpar
        </Button>
      </div>
    </form>
  );
}
