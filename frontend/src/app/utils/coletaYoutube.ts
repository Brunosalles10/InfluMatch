type FiltrosColetaYoutube = {
  busca?: string;
  nicho?: string;
};

/**
 * Escolhe o termo usado na coleta, priorizando a busca digitada.
 */
export function obterTermoColetaYoutube({
  busca,
  nicho,
}: FiltrosColetaYoutube): string | undefined {
  return normalizarTexto(busca) ?? normalizarTexto(nicho);
}

/**
 * Remove espaços e transforma textos vazios em undefined.
 */
function normalizarTexto(valor?: string): string | undefined {
  const textoNormalizado = valor?.trim();

  return textoNormalizado || undefined;
}
