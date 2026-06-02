import type { Nicho } from "@/app/services/types/dominio.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

class NichosService extends ServicoApiBase {
  async listarNichos() {
    return this.buscar<Nicho[]>("/nichos");
  }
}

export const nichosService = new NichosService();
