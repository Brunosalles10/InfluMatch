import { z } from "zod";

import type { TipoDocumentoContato } from "../types/contato-comercial.types";
import {
  converterDataBrasileiraParaIso,
  removerMascaraNumerica,
  validarCep,
  validarCnpj,
  validarCpf,
  validarDataAtualOuFuturaIso,
  validarTelefone,
} from "../utils/documentosBrasileiros";

const tiposDocumentoPermitidos = ["CPF", "CNPJ"] as const;

function textoObrigatorio(campo: string, minimo: number, maximo: number) {
  return z
    .string()
    .trim()
    .min(1, `${campo} é obrigatório.`)
    .min(minimo, `${campo} deve ter no mínimo ${minimo} caracteres.`)
    .max(maximo, `${campo} deve ter no máximo ${maximo} caracteres.`);
}

function campoNumericoObrigatorio(
  campo: string,
  validar: (valor: string) => boolean,
  mensagemInvalido: string,
) {
  return z.preprocess(
    removerMascaraNumerica,
    z.string().min(1, `${campo} é obrigatório.`).refine(validar, {
      message: mensagemInvalido,
    }),
  );
}

export const contatoComercialSchema = z
  .object({
    nome: textoObrigatorio("Nome", 3, 100),

    email: z
      .string()
      .trim()
      .min(1, "Email é obrigatório.")
      .email("Email inválido.")
      .transform((email) => email.toLowerCase()),

    telefone: campoNumericoObrigatorio(
      "Telefone",
      validarTelefone,
      "Telefone deve conter 10 ou 11 dígitos.",
    ),

    tipoDocumento: z.enum(tiposDocumentoPermitidos, {
      message: "Selecione CPF ou CNPJ.",
    }),

    documento: z.preprocess(
      removerMascaraNumerica,
      z.string().min(1, "Documento é obrigatório."),
    ),

    cep: campoNumericoObrigatorio(
      "CEP",
      validarCep,
      "CEP deve conter 8 dígitos.",
    ),

    dataPrevista: z.preprocess(
      converterDataBrasileiraParaIso,
      z
        .string()
        .min(1, "Data prevista é obrigatória.")
        .refine(validarDataAtualOuFuturaIso, {
          message: "Informe uma data válida e não anterior à data atual.",
        }),
    ),

    mensagem: textoObrigatorio("Mensagem", 10, 500),
  })
  .superRefine((dados, ctx) => {
    const tipoDocumento = dados.tipoDocumento as TipoDocumentoContato;

    if (tipoDocumento === "CPF" && !validarCpf(dados.documento)) {
      ctx.addIssue({
        code: "custom",
        path: ["documento"],
        message: "Informe um CPF válido.",
      });
    }

    if (tipoDocumento === "CNPJ" && !validarCnpj(dados.documento)) {
      ctx.addIssue({
        code: "custom",
        path: ["documento"],
        message: "Informe um CNPJ válido.",
      });
    }
  });

export type EntradaContatoComercial = z.input<typeof contatoComercialSchema>;

export type DadosContatoComercial = z.output<typeof contatoComercialSchema>;
