import type {
  ParametrosPaginacao,
  RespostaPaginada,
} from "@/app/types/api.types";
import type {
  Conteudo,
  Plataforma,
  TipoConteudo,
} from "@/app/types/dominio.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

export type FiltrosConteudos = ParametrosPaginacao & {
  plataforma?: Plataforma;
  tipoConteudo?: TipoConteudo;
  nicho?: string;
  busca?: string;
};

class ConteudosService extends ServicoApiBase {
  async listarConteudos(filtros: FiltrosConteudos = {}) {
    return this.buscar<RespostaPaginada<Conteudo>>("/conteudos", filtros);
  }

  async buscarConteudoPorId(id: string) {
    return this.buscar<Conteudo>(`/conteudos/${id}`);
  }
}

export const conteudosService = new ConteudosService();
