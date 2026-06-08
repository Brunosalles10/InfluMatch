import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/Table";
import type { RankingInfluenciador } from "@/app/services/types/ranking.types";
import {
  formatarNumeroCompacto,
  formatarPercentual,
} from "@/app/utils/formatadores";
import { calcularPosicaoRanking } from "../utils/criadores.helpers";

type CriadoresRankingTableProps = {
  criadores: RankingInfluenciador[];
  page: number;
  limit: number;
};

export function CriadoresRankingTable({
  criadores,
  page,
  limit,
}: CriadoresRankingTableProps) {
  return (
    <div className="hidden lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Posição</TableHead>
            <TableHead>Criador</TableHead>
            <TableHead>Nicho</TableHead>
            <TableHead>Seguidores</TableHead>
            <TableHead>Engajamento</TableHead>
            <TableHead>Visualizações</TableHead>
            <TableHead>Crescimento</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {criadores.map((criador, indice) => (
            <TableRow key={criador.id}>
              <TableCell>
                <Badge variante="primary">
                  #{calcularPosicaoRanking(indice, page, limit)}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    nome={criador.nome}
                    imagemUrl={criador.imagemUrl}
                    className="h-11 w-11"
                  />

                  <div>
                    <p className="font-semibold text-text-primary">
                      {criador.nome}
                    </p>

                    <p className="text-sm text-text-muted">
                      {criador.username
                        ? `@${criador.username}`
                        : "Username não informado"}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                {criador.nicho ? (
                  <Badge variante="secondary">{criador.nicho}</Badge>
                ) : (
                  <span className="text-text-muted">Não disponível</span>
                )}
              </TableCell>

              <TableCell>
                {formatarNumeroCompacto(criador.seguidores)}
              </TableCell>

              <TableCell>
                <span className="font-semibold text-success">
                  {formatarPercentual(criador.taxaEngajamento)}
                </span>
              </TableCell>

              <TableCell>
                {formatarNumeroCompacto(criador.visualizacoes)}
              </TableCell>

              <TableCell>
                {criador.crescimentoPercentual !== undefined &&
                criador.crescimentoPercentual !== null ? (
                  <span className="font-semibold text-success">
                    {formatarPercentual(criador.crescimentoPercentual)}
                  </span>
                ) : (
                  <span className="text-text-muted">Não disponível</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
