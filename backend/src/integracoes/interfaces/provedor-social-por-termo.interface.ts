export interface ProvedorSocialPorTermo<TEntrada, TSaida> {
  coletarPorTermo(dto: TEntrada): Promise<TSaida>;
}
