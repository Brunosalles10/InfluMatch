import { removerMascaraNumerica } from "./documentosBrasileiros";

export function aplicarMascaraCpf(valor: string): string {
  return removerMascaraNumerica(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function aplicarMascaraCnpj(valor: string): string {
  return removerMascaraNumerica(valor)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function aplicarMascaraTelefone(valor: string): string {
  const telefone = removerMascaraNumerica(valor).slice(0, 11);

  if (telefone.length <= 10) {
    return telefone
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return telefone
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function aplicarMascaraCep(valor: string): string {
  return removerMascaraNumerica(valor)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
}

export function aplicarMascaraDataBrasileira(valor: string): string {
  return removerMascaraNumerica(valor)
    .slice(0, 8)
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}
