export function formatarNumeroCompacto(valor?: number | null) {
  if (valor === undefined || valor === null) {
    return "N/D";
  }

  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(valor);
}

export function formatarPercentual(valor?: number | null) {
  if (valor === undefined || valor === null) {
    return "N/D";
  }

  const percentual = Math.abs(valor) <= 1 ? valor * 100 : valor;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
    .format(percentual)
    .concat("%");
}

export function limitarTexto(texto: string, limite = 90) {
  if (texto.length <= limite) {
    return texto;
  }

  return `${texto.slice(0, limite).trim()}...`;
}
