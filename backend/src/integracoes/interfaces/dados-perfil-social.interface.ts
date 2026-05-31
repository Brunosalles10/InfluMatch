import { Plataforma } from '@prisma/client';

export interface DadosPerfilSocial {
  plataforma: Plataforma;
  identificadorExterno: string;
  nome: string;
  nomeUsuario: string;
  descricao?: string | null;
  imagemUrl?: string | null;
  urlPerfil?: string | null;
  totalSeguidores: bigint;
  totalVisualizacoes: bigint;
  totalConteudos: number;
}
