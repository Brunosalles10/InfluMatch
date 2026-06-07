import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { OPCOES_NICHOS_HOME } from "@/app/features/home/data/home.constantes";
import { ConstrutorRotasHome } from "@/app/features/home/utils/ConstrutorRotasHome";
import {
  filtroBuscaHomeSchema,
  type DadosFiltroBuscaHome,
  type EntradaFiltroBuscaHome,
} from "@/app/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { NicheChips } from "./NicheChips";

export function HomeSearchForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EntradaFiltroBuscaHome, unknown, DadosFiltroBuscaHome>({
    resolver: zodResolver(filtroBuscaHomeSchema),
    defaultValues: {
      busca: "",
      nicho: "",
      plataforma: undefined,
      tipoConteudo: undefined,
    },
  });

  const valorNichoSelecionado = watch("nicho");

  const nichoSelecionado = obterTextoFormulario(valorNichoSelecionado);

  function obterTextoFormulario(valor: unknown) {
    return typeof valor === "string" ? valor : undefined;
  }

  function selecionarNicho(nicho: string) {
    setValue("nicho", nicho, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function redirecionarParaCriadores(dados: DadosFiltroBuscaHome) {
    const rota = ConstrutorRotasHome.criarRotaCriadores(dados);

    navigate(rota);
  }

  function redirecionarParaVideosVirais(dados: DadosFiltroBuscaHome) {
    const rota = ConstrutorRotasHome.criarRotaVideosVirais(dados);

    navigate(rota);
  }

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <div className="rounded-3xl border border-border bg-surface/80 p-4 shadow-card backdrop-blur-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px_auto_auto]">
          <Input
            placeholder="Buscar por nome, nicho ou @username..."
            erro={errors.busca?.message}
            iconeEsquerda={<Search className="h-5 w-5" />}
            {...register("busca")}
          />

          <Select
            placeholder="Todos os nichos"
            opcoes={OPCOES_NICHOS_HOME}
            erro={errors.nicho?.message}
            {...register("nicho")}
          />

          <Button
            type="button"
            onClick={handleSubmit(redirecionarParaCriadores)}
          >
            Buscar criadores
          </Button>

          <Button
            type="button"
            variante="secondary"
            onClick={handleSubmit(redirecionarParaVideosVirais)}
          >
            Buscar vídeos
          </Button>
        </div>
      </div>

      <NicheChips
        nichoSelecionado={nichoSelecionado}
        aoSelecionarNicho={selecionarNicho}
      />
    </div>
  );
}
