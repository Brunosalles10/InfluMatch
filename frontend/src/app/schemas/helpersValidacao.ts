import { z } from "zod";
import { LIMITE_MAXIMO, TAMANHO_MINIMO_SENHA } from "./constantesValidacao";

export function normalizarTextoOpcional(valor: unknown) {
  if (typeof valor !== "string") {
    return valor;
  }

  const texto = valor.trim();

  return texto.length > 0 ? texto : undefined;
}

export function normalizarNumeroOpcional(valor: unknown) {
  if (valor === undefined || valor === null || valor === "") {
    return undefined;
  }

  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : valor;
}

export function criarTextoObrigatorio(nomeCampo: string, tamanhoMaximo = 120) {
  return z
    .string()
    .trim()
    .min(1, `${nomeCampo} é obrigatório.`)
    .max(
      tamanhoMaximo,
      `${nomeCampo} deve ter no máximo ${tamanhoMaximo} caracteres.`,
    );
}

export function criarTextoOpcional(tamanhoMaximo = 120) {
  return z.preprocess(
    normalizarTextoOpcional,
    z
      .string()
      .trim()
      .max(
        tamanhoMaximo,
        `O texto deve ter no máximo ${tamanhoMaximo} caracteres.`,
      )
      .optional(),
  );
}

export function criarEnumOpcional<
  TValores extends readonly [string, ...string[]],
>(valoresPermitidos: TValores, mensagemErro: string) {
  return z.preprocess(
    normalizarTextoOpcional,
    z
      .string()
      .refine(
        (valor): valor is TValores[number] =>
          valoresPermitidos.includes(valor as TValores[number]),
        {
          message: mensagemErro,
        },
      )
      .optional(),
  );
}

export function criarNumeroInteiroComDefault(
  nomeCampo: string,
  valorPadrao: number,
  valorMinimo: number,
  valorMaximo = LIMITE_MAXIMO,
) {
  return z.preprocess(
    normalizarNumeroOpcional,
    z
      .number()
      .int(`${nomeCampo} deve ser um número inteiro.`)
      .min(
        valorMinimo,
        `${nomeCampo} deve ser maior ou igual a ${valorMinimo}.`,
      )
      .max(
        valorMaximo,
        `${nomeCampo} deve ser menor ou igual a ${valorMaximo}.`,
      )
      .default(valorPadrao),
  );
}

export const emailObrigatorioSchema = z
  .string()
  .trim()
  .min(1, "Email é obrigatório.")
  .email("Informe um email válido.")
  .transform((email) => email.toLowerCase());

export const emailOpcionalSchema = z.preprocess(
  normalizarTextoOpcional,
  z
    .string()
    .trim()
    .email("Informe um email válido.")
    .transform((email) => email.toLowerCase())
    .optional(),
);

export const senhaObrigatoriaSchema = z.string().min(1, "Senha é obrigatória.");

export const senhaForteSchema = z
  .string()
  .min(1, "Senha é obrigatória.")
  .min(
    TAMANHO_MINIMO_SENHA,
    `Senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
  )
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula.")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número.")
  .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial.");
