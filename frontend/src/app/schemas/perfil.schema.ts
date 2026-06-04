import { z } from "zod";
import { TAMANHO_MAXIMO_NOME } from "./constantesValidacao";
import { criarTextoOpcional, emailOpcionalSchema } from "./helpersValidacao";

export const atualizarPerfilSchema = z
  .object({
    nome: criarTextoOpcional(TAMANHO_MAXIMO_NOME),
    email: emailOpcionalSchema,
  })
  .refine((dados) => Boolean(dados.nome || dados.email), {
    message: "Informe pelo menos um campo para atualizar.",
    path: ["nome"],
  });

export type DadosAtualizarPerfil = z.infer<typeof atualizarPerfilSchema>;
