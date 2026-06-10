import type { RankingConteudo } from "@/app/services/types/ranking.types";
import { calcularPosicaoConteudo } from "../utils/conteudos.helpers";
import { ConteudoViralCard } from "./ConteudoViralCard";

type ConteudosGridProps = {
  conteudos: RankingConteudo[];
  page: number;
  limit: number;
};

export function ConteudosGrid({ conteudos, page, limit }: ConteudosGridProps) {
  return (
    <div className="grid gap-5">
      {conteudos.map((conteudo, indice) => (
        <ConteudoViralCard
          key={conteudo.id}
          conteudo={conteudo}
          posicao={calcularPosicaoConteudo(indice, page, limit)}
        />
      ))}
    </div>
  );
}
