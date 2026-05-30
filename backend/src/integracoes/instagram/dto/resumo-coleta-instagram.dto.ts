import { Plataforma } from '@prisma/client';

export interface NichoResumoColetaInstagramDto {
  id: string;
  nome: string;
  slug: string;
}

export interface ResumoColetaInstagramDto {
  mensagem: string;
  plataforma: Plataforma;
  termo: string;
  hashtagsUtilizadas: string[];
  nicho: NichoResumoColetaInstagramDto;
  totalHashtagsProcessadas: number;
  totalMidiasEncontradas: number;
  totalConteudosProcessados: number;
  retornadoDoCache: boolean;
  atualizadoEm: string;
}
