import { z } from "zod";
import { TAMANHO_MAXIMO_NICHO } from "./constantesValidacao";
import {
  criarNumeroInteiroComDefault,
  criarTextoObrigatorio,
} from "./helpersValidacao";

export const coletaYoutubeSchema = z.object({
  nicho: criarTextoObrigatorio("Nicho", TAMANHO_MAXIMO_NICHO),
  quantidadeResultados: criarNumeroInteiroComDefault(
    "Quantidade de resultados",
    10,
    1,
    50,
  ),
});

export type EntradaColetaYoutube = z.input<typeof coletaYoutubeSchema>;

export type DadosColetaYoutube = z.output<typeof coletaYoutubeSchema>;
