import { Plataforma, TipoConteudo } from '@prisma/client';

export interface DadosConteudoSocial {
  plataforma: Plataforma;
  tipoConteudo: TipoConteudo;
  identificadorExterno: string;
  titulo: string;
  descricao?: string | null;
  urlConteudo?: string | null;
  urlThumbnail?: string | null;
  totalViews: bigint;
  totalLikes: bigint;
  totalComentarios: bigint;
  taxaEngajamento: number;
  publicadoEm?: Date | null;
}
