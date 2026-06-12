import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import {
  coletaYoutubeSchema,
  type DadosColetaYoutube,
  type EntradaColetaYoutube,
} from "@/app/schemas";

type ColetaYoutubeFormProps = {
  carregando: boolean;
  aoColetar: (dados: DadosColetaYoutube) => Promise<void>;
};

export function ColetaYoutubeForm({
  carregando,
  aoColetar,
}: ColetaYoutubeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntradaColetaYoutube, unknown, DadosColetaYoutube>({
    resolver: zodResolver(coletaYoutubeSchema),
    defaultValues: {
      nicho: "",
      quantidadeResultados: 10,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executar coleta do YouTube</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(aoColetar)}>
          <Input
            label="Nicho"
            placeholder="Ex: games, tecnologia, moda, fitness..."
            erro={errors.nicho?.message}
            iconeEsquerda={<Search className="h-5 w-5" />}
            {...register("nicho")}
          />

          <Input
            label="Quantidade de resultados"
            type="number"
            min={1}
            max={25}
            erro={errors.quantidadeResultados?.message}
            {...register("quantidadeResultados")}
          />

          <Button type="submit" carregando={carregando}>
            Coletar dados
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
