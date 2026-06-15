import type {
  ColetarYoutubeDto,
  ResumoColetaYoutube,
} from "@/app/types/youtube.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

class YoutubeIntegracaoService extends ServicoApiBase {
  async coletarDados(dados: ColetarYoutubeDto): Promise<ResumoColetaYoutube> {
    return this.criar<ResumoColetaYoutube, ColetarYoutubeDto>(
      "/integracoes/youtube/coletar",
      dados,
    );
  }
}

export const youtubeIntegracaoService = new YoutubeIntegracaoService();
