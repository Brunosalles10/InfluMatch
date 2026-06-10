import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import {
  filtroRankingConteudosSchema,
  type DadosFiltroRankingConteudos,
  type EntradaFiltroRankingConteudos,
} from "@/app/schemas";

type ConteudosFiltrosProps = {
  filtrosAtuais: DadosFiltroRankingConteudos;
  aoAplicarFiltros: (filtros: DadosFiltroRankingConteudos) => void;
  aoLimparFiltros: () => void;
};

const opcoesPlataforma = [
  { label: "Todas", value: "" },
  { label: "YouTube", value: "YOUTUBE" },
  { label: "Instagram", value: "INSTAGRAM" },
  { label: "TikTok", value: "TIKTOK" },
];

const opcoesTipoConteudo = [
  { label: "Todos os tipos", value: "" },
  { label: "Vídeo", value: "VIDEO" },
  { label: "Short", value: "SHORT" },
  { label: "Post", value: "POST" },
  { label: "Reel", value: "REEL" },
];

const opcoesOrdenacao = [
  { label: "Viral", value: "viral" },
  { label: "Views", value: "views" },
  { label: "Engajamento", value: "engajamento" },
  { label: "Mais recentes", value: "recente" },
];

export function ConteudosFiltros({
  filtrosAtuais,
  aoAplicarFiltros,
  aoLimparFiltros,
}: ConteudosFiltrosProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    EntradaFiltroRankingConteudos,
    unknown,
    DadosFiltroRankingConteudos
  >({
    resolver: zodResolver(filtroRankingConteudosSchema),
    defaultValues: {
      busca: filtrosAtuais.busca ?? "",
      nicho: filtrosAtuais.nicho ?? "",
      plataforma: filtrosAtuais.plataforma ?? "",
      tipoConteudo: filtrosAtuais.tipoConteudo ?? "",
      ordenarPor: filtrosAtuais.ordenarPor ?? "viral",
      page: filtrosAtuais.page,
      limit: filtrosAtuais.limit,
    },
  });

  function enviarFormulario(dados: DadosFiltroRankingConteudos) {
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
      <div className="grid gap-4 xl:grid-cols-[1fr_150px_160px_160px_170px_auto_auto]">
        <Input
          placeholder="Buscar por título, criador ou palavra-chave..."
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
          opcoes={opcoesTipoConteudo}
          erro={errors.tipoConteudo?.message}
          {...register("tipoConteudo")}
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
