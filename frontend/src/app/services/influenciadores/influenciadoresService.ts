import type {
  ParametrosPaginacao,
  RespostaPaginada,
} from "@/app/types/api.types";
import type { Influenciador, Plataforma } from "@/app/types/dominio.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

export type FiltrosInfluenciadores = ParametrosPaginacao & {
  plataforma?: Plataforma;
  nicho?: string;
  busca?: string;
};

class InfluenciadoresService extends ServicoApiBase {
  async listarInfluenciadores(filtros: FiltrosInfluenciadores = {}) {
    return this.buscar<RespostaPaginada<Influenciador>>(
      "/influenciadores",
      filtros,
    );
  }

  async buscarInfluenciadorPorId(id: string) {
    return this.buscar<Influenciador>(`/influenciadores/${id}`);
  }
}

export const influenciadoresService = new InfluenciadoresService();
