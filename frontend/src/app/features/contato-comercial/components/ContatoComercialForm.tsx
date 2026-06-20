import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import type { ChangeEvent } from "react";
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
  contatoComercialSchema,
  type DadosContatoComercial,
  type EntradaContatoComercial,
} from "@/app/schemas";
import type { TipoDocumentoContato } from "@/app/types/contato-comercial.types";
import { combinarClasses } from "@/app/utils/cn";
import {
  aplicarMascaraCep,
  aplicarMascaraCnpj,
  aplicarMascaraCpf,
  aplicarMascaraDataBrasileira,
  aplicarMascaraTelefone,
} from "@/app/utils/mascaras";

type ContatoComercialFormProps = {
  carregando: boolean;
  aoEnviar: (dados: DadosContatoComercial) => Promise<void>;
};

export function ContatoComercialForm({
  carregando,
  aoEnviar,
}: ContatoComercialFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EntradaContatoComercial, unknown, DadosContatoComercial>({
    resolver: zodResolver(contatoComercialSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      tipoDocumento: "CNPJ",
      documento: "",
      cep: "",
      dataPrevista: "",
      mensagem: "",
    },
  });

  const tipoDocumento = watch("tipoDocumento");

  const telefone = register("telefone");
  const documento = register("documento");
  const cep = register("cep");
  const dataPrevista = register("dataPrevista");
  const tipoDocumentoRegister = register("tipoDocumento");

  useEffect(() => {
    setValue("documento", "", {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [setValue, tipoDocumento]);

  function aplicarMascara(
    event: ChangeEvent<HTMLInputElement>,
    mascara: (valor: string) => string,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  ) {
    event.target.value = mascara(event.target.value);
    onChange(event);
  }

  function aplicarMascaraDocumento(valor: string, tipo: TipoDocumentoContato) {
    if (tipo === "CPF") {
      return aplicarMascaraCpf(valor);
    }

    return aplicarMascaraCnpj(valor);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do contato comercial</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(aoEnviar)}>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Nome"
              placeholder="Nome do responsável ou empresa"
              erro={errors.nome?.message}
              iconeEsquerda={<User className="h-4 w-4" />}
              {...register("nome")}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="contato@empresa.com"
              erro={errors.email?.message}
              iconeEsquerda={<Mail className="h-4 w-4" />}
              {...register("email")}
            />

            <Input
              label="Telefone"
              placeholder="(44) 99999-9999"
              erro={errors.telefone?.message}
              iconeEsquerda={<Phone className="h-4 w-4" />}
              {...telefone}
              onChange={(event) =>
                aplicarMascara(event, aplicarMascaraTelefone, telefone.onChange)
              }
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Tipo de documento
              </label>

              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                <select
                  className={combinarClasses(
                    "h-11 w-full rounded-xl border border-border bg-surface px-10 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                    errors.tipoDocumento &&
                      "border-danger focus:border-danger focus:ring-danger/20",
                  )}
                  {...tipoDocumentoRegister}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
              </div>

              {errors.tipoDocumento?.message && (
                <p className="text-sm text-danger">
                  {errors.tipoDocumento.message}
                </p>
              )}
            </div>

            <Input
              label={tipoDocumento === "CPF" ? "CPF" : "CNPJ"}
              placeholder={
                tipoDocumento === "CPF"
                  ? "000.000.000-00"
                  : "00.000.000/0000-00"
              }
              erro={errors.documento?.message}
              iconeEsquerda={<FileText className="h-4 w-4" />}
              {...documento}
              onChange={(event) =>
                aplicarMascara(
                  event,
                  (valor) => aplicarMascaraDocumento(valor, tipoDocumento),
                  documento.onChange,
                )
              }
            />

            <Input
              label="CEP"
              placeholder="00000-000"
              erro={errors.cep?.message}
              iconeEsquerda={<MapPin className="h-4 w-4" />}
              {...cep}
              onChange={(event) =>
                aplicarMascara(event, aplicarMascaraCep, cep.onChange)
              }
            />

            <Input
              label="Data esperada para receber orçamento"
              placeholder="dd/mm/aaaa"
              erro={errors.dataPrevista?.message}
              iconeEsquerda={<CalendarDays className="h-4 w-4" />}
              {...dataPrevista}
              onChange={(event) =>
                aplicarMascara(
                  event,
                  aplicarMascaraDataBrasileira,
                  dataPrevista.onChange,
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Mensagem
            </label>

            <textarea
              className={combinarClasses(
                "min-h-32 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                errors.mensagem &&
                  "border-danger focus:border-danger focus:ring-danger/20",
              )}
              placeholder="Descreva o objetivo da campanha, produto, público-alvo ou tipo de criador desejado."
              {...register("mensagem")}
            />

            {errors.mensagem?.message && (
              <p className="text-sm text-danger">{errors.mensagem.message}</p>
            )}
          </div>

          <Button type="submit" carregando={carregando || isSubmitting}>
            Enviar mensagem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
