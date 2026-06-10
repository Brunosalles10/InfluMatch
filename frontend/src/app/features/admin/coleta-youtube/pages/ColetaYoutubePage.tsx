import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/app/components/feedback/ErrorState";
import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { mapearColetaYoutubeParaDto } from "@/app/mappers/youtube.mapper";
import type { DadosColetaYoutube } from "@/app/schemas";
import { ErroApi } from "@/app/services/api/ErroApi";
import { youtubeIntegracaoService } from "@/app/services/integracoes/youtubeIntegracaoService";
import type { ResumoColetaYoutube } from "@/app/services/types/youtube.types";
import { ColetaYoutubeForm } from "../components/ColetaYoutubeForm";
import { ResumoColetaYoutubeCard } from "../components/ResumoColetaYoutubeCard";

export function ColetaYoutubePage() {
  const queryClient = useQueryClient();
  const [resumoColeta, setResumoColeta] = useState<ResumoColetaYoutube | null>(
    null,
  );

  const coletaMutation = useMutation({
    mutationFn: (dados: DadosColetaYoutube) =>
      youtubeIntegracaoService.coletarDados(mapearColetaYoutubeParaDto(dados)),
    onSuccess: (resumo) => {
      setResumoColeta(resumo);

      queryClient.invalidateQueries({
        queryKey: ["ranking-influenciadores"],
      });

      queryClient.invalidateQueries({
        queryKey: ["ranking-conteudos"],
      });

      queryClient.invalidateQueries({
        queryKey: ["home"],
      });

      toast.success("Coleta do YouTube concluída com sucesso.");
    },
    onError: (erro) => {
      if (erro instanceof ErroApi) {
        toast.error(erro.message);
        return;
      }

      toast.error("Não foi possível executar a coleta do YouTube.");
    },
  });

  async function coletarDados(dados: DadosColetaYoutube) {
    await coletaMutation.mutateAsync(dados);
  }

  return (
    <PageContainer className="space-y-8">
      <SectionHeader
        titulo="Coleta de dados do YouTube"
        descricao="Área administrativa para alimentar os rankings com dados coletados pela YouTube Data API v3."
      />

      <ColetaYoutubeForm
        carregando={coletaMutation.isPending}
        aoColetar={coletarDados}
      />

      {coletaMutation.isError && (
        <ErrorState
          titulo="Erro ao executar coleta"
          descricao="Verifique sua chave da API, permissões, quota disponível ou tente novamente."
          tentarNovamente={() => coletaMutation.reset()}
        />
      )}

      {resumoColeta && <ResumoColetaYoutubeCard resumo={resumoColeta} />}
    </PageContainer>
  );
}
