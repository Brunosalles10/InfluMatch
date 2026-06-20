import type {
  ContatoComercialValidado,
  ValidarContatoComercialDto,
} from "@/app/types/contato-comercial.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

class ContatoComercialService extends ServicoApiBase {
  async enviarContato(
    dados: ValidarContatoComercialDto,
  ): Promise<ContatoComercialValidado> {
    return this.criar<ContatoComercialValidado, ValidarContatoComercialDto>(
      "/contato-comercial/enviar",
      dados,
    );
  }
}

export const contatoComercialService = new ContatoComercialService();
