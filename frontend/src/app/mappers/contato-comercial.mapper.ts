import type { DadosContatoComercial } from "../schemas";
import type { ValidarContatoComercialDto } from "../types/contato-comercial.types";

export function mapearContatoComercialParaDto(
  dados: DadosContatoComercial,
): ValidarContatoComercialDto {
  return {
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    tipoDocumento: dados.tipoDocumento,
    documento: dados.documento,
    cep: dados.cep,
    dataPrevista: dados.dataPrevista,
    mensagem: dados.mensagem,
  };
}
