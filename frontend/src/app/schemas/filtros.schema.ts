import { z } from "zod";
import {
  LIMITE_PADRAO,
  ORDENACOES_CONTEUDOS,
  ORDENACOES_INFLUENCIADORES,
  PAGINA_PADRAO,
  PLATAFORMAS,
  TAMANHO_MAXIMO_BUSCA,
  TAMANHO_MAXIMO_NICHO,
  TIPOS_CONTEUDO,
} from "./constantesValidacao";
import {
  criarEnumOpcional,
  criarNumeroInteiroComDefault,
  criarTextoOpcional,
} from "./helpersValidacao";

const plataformaSchema = criarEnumOpcional(PLATAFORMAS, "Plataforma inválida.");

const tipoConteudoSchema = criarEnumOpcional(
  TIPOS_CONTEUDO,
  "Tipo de conteúdo inválido.",
);

const ordenacaoConteudosSchema = criarEnumOpcional(
  ORDENACOES_CONTEUDOS,
  "Ordenação de conteúdos inválida.",
);

const ordenacaoInfluenciadoresSchema = criarEnumOpcional(
  ORDENACOES_INFLUENCIADORES,
  "Ordenação de influenciadores inválida.",
);

const pageSchema = criarNumeroInteiroComDefault(
  "Página",
  PAGINA_PADRAO,
  1,
  9999,
);

const limitSchema = criarNumeroInteiroComDefault(
  "Limite",
  LIMITE_PADRAO,
  1,
  50,
);

export const filtroRankingConteudosSchema = z.object({
  plataforma: plataformaSchema,
  tipoConteudo: tipoConteudoSchema,
  nicho: criarTextoOpcional(TAMANHO_MAXIMO_NICHO),
  busca: criarTextoOpcional(TAMANHO_MAXIMO_BUSCA),
  ordenarPor: ordenacaoConteudosSchema,
  page: pageSchema,
  limit: limitSchema,
});

export type DadosFiltroRankingConteudos = z.infer<
  typeof filtroRankingConteudosSchema
>;

export const filtroRankingInfluenciadoresSchema = z.object({
  plataforma: plataformaSchema,
  nicho: criarTextoOpcional(TAMANHO_MAXIMO_NICHO),
  busca: criarTextoOpcional(TAMANHO_MAXIMO_BUSCA),
  ordenarPor: ordenacaoInfluenciadoresSchema,
  page: pageSchema,
  limit: limitSchema,
});

export type DadosFiltroRankingInfluenciadores = z.infer<
  typeof filtroRankingInfluenciadoresSchema
>;

export const filtroBuscaHomeSchema = z.object({
  busca: criarTextoOpcional(TAMANHO_MAXIMO_BUSCA),
  nicho: criarTextoOpcional(TAMANHO_MAXIMO_NICHO),
  plataforma: plataformaSchema,
  tipoConteudo: tipoConteudoSchema,
});

export type DadosFiltroBuscaHome = z.infer<typeof filtroBuscaHomeSchema>;
