import type { DadosColetaYoutube } from "@/app/schemas";
import type { ColetarYoutubeDto } from "@/app/types/youtube.types";

export function mapearColetaYoutubeParaDto(
  dados: DadosColetaYoutube,
): ColetarYoutubeDto {
  return {
    nicho: dados.nicho,
    quantidadeResultados: dados.quantidadeResultados,
  };
}
