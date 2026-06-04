import { z } from "zod";
import { TAMANHO_MAXIMO_NOME } from "./constantesValidacao";
import {
  criarTextoObrigatorio,
  emailObrigatorioSchema,
  senhaForteSchema,
  senhaObrigatoriaSchema,
} from "./helpersValidacao";

export const loginSchema = z.object({
  email: emailObrigatorioSchema,
  senha: senhaObrigatoriaSchema,
});

export type DadosLogin = z.infer<typeof loginSchema>;

export const cadastroSchema = z
  .object({
    nome: criarTextoObrigatorio("Nome", TAMANHO_MAXIMO_NOME),
    email: emailObrigatorioSchema,
    senha: senhaForteSchema,
    confirmarSenha: z.string().min(1, "Confirmação de senha é obrigatória."),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não conferem.",
    path: ["confirmarSenha"],
  });

export type DadosCadastro = z.infer<typeof cadastroSchema>;

export const alterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória."),
    novaSenha: senhaForteSchema,
    confirmarNovaSenha: z
      .string()
      .min(1, "Confirmação da nova senha é obrigatória."),
  })
  .refine((dados) => dados.novaSenha === dados.confirmarNovaSenha, {
    message: "As senhas não conferem.",
    path: ["confirmarNovaSenha"],
  })
  .refine((dados) => dados.senhaAtual !== dados.novaSenha, {
    message: "A nova senha deve ser diferente da senha atual.",
    path: ["novaSenha"],
  });

export type DadosAlterarSenha = z.infer<typeof alterarSenhaSchema>;
