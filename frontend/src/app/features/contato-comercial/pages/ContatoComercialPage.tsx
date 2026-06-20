import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/app/components/feedback/ErrorState";
import { PageContainer } from "@/app/components/layout/PageContainer";
import { SectionHeader } from "@/app/components/layout/SectionHeader.tsx";
import { mapearContatoComercialParaDto } from "@/app/mappers/contato-comercial.mapper";
import type { DadosContatoComercial } from "@/app/schemas";
import { ErroApi } from "@/app/services/api/ErroApi";
import { contatoComercialService } from "@/app/services/contato-comercial/contatoComercialService";
import type { ContatoComercialValidado } from "@/app/types/contato-comercial.types";
import { ContatoComercialForm } from "../components/ContatoComercialForm";
import { ContatoComercialOrientacoesCard } from "../components/ContatoComercialOrientacoesCard";
import { ContatoComercialSucessoCard } from "../components/ContatoComercialSucessoCard";

export function ContatoComercialPage() {
  const [contatoValidado, setContatoValidado] =
    useState<ContatoComercialValidado | null>(null);

  const contatoMutation = useMutation({
    mutationFn: (dados: DadosContatoComercial) => {
      return contatoComercialService.enviarContato(
        mapearContatoComercialParaDto(dados),
      );
    },
    onSuccess: (resposta) => {
      setContatoValidado(resposta);
      toast.success("Contato comercial enviado com sucesso.");
    },
    onError: (erro) => {
      toast.error(obterMensagemErro(erro));
    },
  });

  async function enviarContato(dados: DadosContatoComercial): Promise<void> {
    await contatoMutation.mutateAsync(dados);
  }

  return (
    <PageContainer className="space-y-8 pb-24">
      <SectionHeader
        titulo="Contato comercial"
        descricao="Preencha o formulário para entrar em contato com nossa equipe comercial. Estamos prontos para ajudar você a encontrar as melhores soluções para o seu negócio."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ContatoComercialForm
          carregando={contatoMutation.isPending}
          aoEnviar={enviarContato}
        />

        <aside className="space-y-4">
          <ContatoComercialOrientacoesCard />

          {contatoMutation.isError && (
            <ErrorState
              titulo="Erro no envio"
              descricao={obterMensagemErro(contatoMutation.error)}
              tentarNovamente={() => contatoMutation.reset()}
            />
          )}

          {contatoValidado && (
            <ContatoComercialSucessoCard contatoValidado={contatoValidado} />
          )}
        </aside>
      </div>
    </PageContainer>
  );
}

function obterMensagemErro(erro: unknown) {
  if (erro instanceof ErroApi) {
    return erro.message;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return "Não foi possível enviar o contato comercial.";
}
