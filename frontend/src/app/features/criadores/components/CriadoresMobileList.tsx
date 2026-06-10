import type { RankingInfluenciador } from "@/app/types/ranking.types";
import { calcularPosicaoRanking } from "../utils/criadores.helpers";
import { CriadorRankingCard } from "./CriadorRankingCard";

type CriadoresMobileListProps = {
  criadores: RankingInfluenciador[];
  page: number;
  limit: number;
};

export function CriadoresMobileList({
  criadores,
  page,
  limit,
}: CriadoresMobileListProps) {
  return (
    <div className="grid gap-4 lg:hidden">
      {criadores.map((criador, indice) => (
        <CriadorRankingCard
          key={criador.id}
          criador={criador}
          posicao={calcularPosicaoRanking(indice, page, limit)}
        />
      ))}
    </div>
  );
}
