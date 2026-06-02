type ValorParametro = string | number | boolean | null | undefined;

export function removerParametrosVazios<
  T extends Record<string, ValorParametro>,
>(parametros: T) {
  return Object.fromEntries(
    Object.entries(parametros).filter(([, valor]) => {
      return valor !== undefined && valor !== null && valor !== "";
    }),
  );
}
