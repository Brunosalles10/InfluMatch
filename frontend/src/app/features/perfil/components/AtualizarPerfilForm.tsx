import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useEffect } from "react";
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
  atualizarPerfilSchema,
  type DadosAtualizarPerfil,
  type EntradaAtualizarPerfil,
} from "@/app/schemas";
import type { Usuario } from "@/app/types/usuario.types";

type AtualizarPerfilFormProps = {
  usuario: Usuario;
  carregando: boolean;
  aoAtualizar: (dados: DadosAtualizarPerfil) => Promise<void>;
};

export function AtualizarPerfilForm({
  usuario,
  carregando,
  aoAtualizar,
}: AtualizarPerfilFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntradaAtualizarPerfil, unknown, DadosAtualizarPerfil>({
    resolver: zodResolver(atualizarPerfilSchema),
    defaultValues: {
      nome: usuario.nome,
      email: usuario.email,
    },
  });

  useEffect(() => {
    reset({
      nome: usuario.nome,
      email: usuario.email,
    });
  }, [reset, usuario.email, usuario.nome]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atualizar dados</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(aoAtualizar)}>
          <Input
            label="Nome"
            placeholder="Seu nome"
            erro={errors.nome?.message}
            iconeEsquerda={<User className="h-5 w-5" />}
            {...register("nome")}
          />

          <Input
            label="Email"
            placeholder="seu@email.com"
            erro={errors.email?.message}
            iconeEsquerda={<Mail className="h-5 w-5" />}
            {...register("email")}
          />

          <Button type="submit" carregando={carregando || isSubmitting}>
            Salvar alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
