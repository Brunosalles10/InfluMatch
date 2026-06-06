import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { useAuth } from "@/app/hooks/useAuth";
import { cadastroSchema, type DadosCadastro } from "@/app/schemas";
import { ErroApi } from "@/app/services/api/ErroApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

export function CadastroPage() {
  const { cadastrar } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DadosCadastro>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  async function enviarFormulario(dados: DadosCadastro) {
    try {
      await cadastrar(dados);
    } catch (erro) {
      tratarErroCadastro(erro);
    }
  }

  function tratarErroCadastro(erro: unknown) {
    if (erro instanceof ErroApi) {
      toast.error(erro.message);
      return;
    }

    toast.error("Não foi possível criar sua conta. Tente novamente.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Criar conta</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(enviarFormulario)}>
            <Input
              label="Nome"
              placeholder="Seu nome"
              erro={errors.nome?.message}
              iconeEsquerda={<User className="h-4 w-4" />}
              {...register("nome")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="seuemail@exemplo.com"
              erro={errors.email?.message}
              iconeEsquerda={<Mail className="h-4 w-4" />}
              {...register("email")}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Crie uma senha forte"
              erro={errors.senha?.message}
              iconeEsquerda={<Lock className="h-4 w-4" />}
              {...register("senha")}
            />

            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Repita sua senha"
              erro={errors.confirmarSenha?.message}
              iconeEsquerda={<Lock className="h-4 w-4" />}
              {...register("confirmarSenha")}
            />

            <Button larguraTotal carregando={isSubmitting} type="submit">
              Criar conta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
