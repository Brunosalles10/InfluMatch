import { Plataforma } from '@prisma/client';

export interface NichoResumoColetaYoutubeDto {
  id: string;
  nome: string;
  slug: string;
}

export interface ResumoColetaYoutubeDto {
  mensagem: string;
  plataforma: Plataforma;
  nicho: NichoResumoColetaYoutubeDto;
  totalVideosEncontrados: number;
  totalCanaisProcessados: number;
  totalConteudosProcessados: number;
  retornadoDoCache: boolean;
  atualizadoEm: string;
}
