import type { PlanoPreco } from "../data/precos.constantes";

export class ConstrutorAcoesPrecos {
  static obterRota(plano: PlanoPreco) {
    if (plano.tipoAcao === "CADASTRO") {
      return "/cadastro";
    }

    return null;
  }

  static obterMensagemPlaceholder(plano: PlanoPreco) {
    if (plano.id === "pro") {
      return "O plano Pro será implementado em uma versão futura do InfluMatch.";
    }

    if (plano.id === "enterprise") {
      return "A área comercial será implementada futuramente.";
    }

    return "Funcionalidade planejada para versões futuras.";
  }
}
