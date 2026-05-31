import { Injectable } from '@nestjs/common';
import { Plataforma, Prisma } from '@prisma/client';
import { gerarSlug } from 'src/common/utils/slug.util';
import { DadosConteudoSocial } from 'src/integracoes/interfaces/dados-conteudo-social.interface';
import { DadosPerfilSocial } from 'src/integracoes/interfaces/dados-perfil-social.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstagramRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarOuCriarNicho(nome: string) {
    const slug = gerarSlug(nome);
    const nichoExistente = await this.prisma.nicho.findUnique({
      where: { slug },
    });

    if (nichoExistente) {
      return nichoExistente;
    }

    return this.prisma.nicho.create({
      data: {
        nome: nome.trim(),
        slug,
      },
    });
  }

  async salvarPerfilSocial(
    dadosPerfil: DadosPerfilSocial,
    nichoId: string,
  ) {
    const influenciador = await this.buscarOuCriarInfluenciador(
      dadosPerfil,
      nichoId,
    );

    return this.prisma.perfilSocial.upsert({
      where: {
        plataforma_identificadorExterno: {
          plataforma: Plataforma.INSTAGRAM,
          identificadorExterno: dadosPerfil.identificadorExterno,
        },
      },
      create: {
        plataforma: Plataforma.INSTAGRAM,
        identificadorExterno: dadosPerfil.identificadorExterno,
        nomeUsuario: dadosPerfil.nomeUsuario,
        urlPerfil: dadosPerfil.urlPerfil,
        totalSeguidores: dadosPerfil.totalSeguidores,
        totalVisualizacoes: dadosPerfil.totalVisualizacoes,
        totalConteudos: dadosPerfil.totalConteudos,
        ultimaSincronizacaoEm: new Date(),
        influenciador: {
          connect: { id: influenciador.id },
        },
      },
      update: {
        nomeUsuario: dadosPerfil.nomeUsuario,
        urlPerfil: dadosPerfil.urlPerfil,
        totalSeguidores: dadosPerfil.totalSeguidores,
        totalVisualizacoes: dadosPerfil.totalVisualizacoes,
        ultimaSincronizacaoEm: new Date(),
        influenciador: {
          connect: { id: influenciador.id },
        },
      },
    });
  }

  salvarConteudo(
    dadosConteudo: DadosConteudoSocial,
    perfilSocialId: string,
  ) {
    return this.prisma.conteudo.upsert({
      where: {
        plataforma_identificadorExterno: {
          plataforma: Plataforma.INSTAGRAM,
          identificadorExterno: dadosConteudo.identificadorExterno,
        },
      },
      create: {
        plataforma: Plataforma.INSTAGRAM,
        tipoConteudo: dadosConteudo.tipoConteudo,
        identificadorExterno: dadosConteudo.identificadorExterno,
        titulo: dadosConteudo.titulo,
        descricao: dadosConteudo.descricao,
        urlConteudo: dadosConteudo.urlConteudo,
        urlThumbnail: dadosConteudo.urlThumbnail,
        totalViews: dadosConteudo.totalViews,
        totalLikes: dadosConteudo.totalLikes,
        totalComentarios: dadosConteudo.totalComentarios,
        taxaEngajamento: dadosConteudo.taxaEngajamento,
        publicadoEm: dadosConteudo.publicadoEm,
        perfilSocial: {
          connect: { id: perfilSocialId },
        },
      },
      update: {
        tipoConteudo: dadosConteudo.tipoConteudo,
        titulo: dadosConteudo.titulo,
        descricao: dadosConteudo.descricao,
        urlConteudo: dadosConteudo.urlConteudo,
        urlThumbnail: dadosConteudo.urlThumbnail,
        totalViews: dadosConteudo.totalViews,
        totalLikes: dadosConteudo.totalLikes,
        totalComentarios: dadosConteudo.totalComentarios,
        taxaEngajamento: dadosConteudo.taxaEngajamento,
        publicadoEm: dadosConteudo.publicadoEm,
        perfilSocial: {
          connect: { id: perfilSocialId },
        },
      },
    });
  }

  async atualizarTotalConteudosDoPerfil(perfilSocialId: string) {
    const totalConteudos = await this.prisma.conteudo.count({
      where: { perfilSocialId },
    });

    return this.prisma.perfilSocial.update({
      where: { id: perfilSocialId },
      data: { totalConteudos },
    });
  }

  private async buscarOuCriarInfluenciador(
    dadosPerfil: DadosPerfilSocial,
    nichoId: string,
  ) {
    const influenciadorExistente = await this.prisma.influenciador.findFirst({
      where: {
        nome: dadosPerfil.nome,
        nichoId,
      },
    });

    if (influenciadorExistente) {
      return this.prisma.influenciador.update({
        where: { id: influenciadorExistente.id },
        data: this.montarDadosAtualizacaoInfluenciador(dadosPerfil),
      });
    }

    return this.prisma.influenciador.create({
      data: {
        nome: dadosPerfil.nome,
        descricao: dadosPerfil.descricao,
        imagemUrl: dadosPerfil.imagemUrl,
        nicho: {
          connect: { id: nichoId },
        },
      },
    });
  }

  private montarDadosAtualizacaoInfluenciador(
    dadosPerfil: DadosPerfilSocial,
  ): Prisma.InfluenciadorUpdateInput {
    return {
      descricao: dadosPerfil.descricao ?? undefined,
      imagemUrl: dadosPerfil.imagemUrl ?? undefined,
    };
  }
}
