import { z } from "zod";

export type ResultadoValidacao<TDados> =
  | {
      sucesso: true;
      dados: TDados;
    }
  | {
      sucesso: false;
      erros: string[];
    };

export function obterMensagensErroValidacao(erro: unknown) {
  if (erro instanceof z.ZodError) {
    return erro.issues.map((issue) => issue.message);
  }

  if (erro instanceof Error) {
    return [erro.message];
  }

  return ["Erro de validação inesperado."];
}

export function validarComSchema<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  dados: unknown,
): ResultadoValidacao<z.infer<TSchema>> {
  const resultado = schema.safeParse(dados);

  if (resultado.success) {
    return {
      sucesso: true,
      dados: resultado.data,
    };
  }

  return {
    sucesso: false,
    erros: resultado.error.issues.map((issue) => issue.message),
  };
}
