import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { useAuth } from "@/app/hooks/useAuth";
import { loginSchema, type DadosLogin } from "@/app/schemas";
import { ErroApi } from "@/app/services/api/ErroApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

export function LoginPage() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DadosLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  async function enviarFormulario(dados: DadosLogin) {
    try {
      await login(dados);
    } catch (erro) {
      tratarErroLogin(erro);
    }
  }

  function tratarErroLogin(erro: unknown) {
    if (erro instanceof ErroApi) {
      toast.error(erro.message);
      return;
    }

    toast.error("Não foi possível fazer login. Tente novamente.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Entrar no InfluMatch
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(enviarFormulario)}>
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
              placeholder="Digite sua senha"
              erro={errors.senha?.message}
              iconeEsquerda={<Lock className="h-4 w-4" />}
              {...register("senha")}
            />

            <Button larguraTotal carregando={isSubmitting} type="submit">
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Ainda não tem conta?{" "}
            <Link
              to="/cadastro"
              className="font-semibold text-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
