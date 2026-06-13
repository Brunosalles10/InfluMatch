import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { alterarSenhaSchema, type DadosAlterarSenha } from "@/app/schemas";

type AlterarSenhaFormProps = {
  carregando: boolean;
  aoAlterarSenha: (dados: DadosAlterarSenha) => Promise<void>;
};

export function AlterarSenhaForm({
  carregando,
  aoAlterarSenha,
}: AlterarSenhaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DadosAlterarSenha>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    },
  });

  async function enviarFormulario(dados: DadosAlterarSenha) {
    await aoAlterarSenha(dados);
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar senha</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(enviarFormulario)}>
          <Input
            label="Senha atual"
            type="password"
            placeholder="Digite sua senha atual"
            erro={errors.senhaAtual?.message}
            iconeEsquerda={<Lock className="h-5 w-5" />}
            {...register("senhaAtual")}
          />

          <Input
            label="Nova senha"
            type="password"
            placeholder="Digite sua nova senha"
            erro={errors.novaSenha?.message}
            iconeEsquerda={<Lock className="h-5 w-5" />}
            {...register("novaSenha")}
          />

          <Input
            label="Confirmar nova senha"
            type="password"
            placeholder="Confirme sua nova senha"
            erro={errors.confirmarNovaSenha?.message}
            iconeEsquerda={<Lock className="h-5 w-5" />}
            {...register("confirmarNovaSenha")}
          />

          <Button
            type="submit"
            variante="secondary"
            carregando={carregando || isSubmitting}
          >
            Alterar senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
