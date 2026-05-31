export function bigIntParaNumero(
  valor: bigint | number | null | undefined,
): number {
  if (valor === null || valor === undefined) return 0;
  return Number(valor);
}
