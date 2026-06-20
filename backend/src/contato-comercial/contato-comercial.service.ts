import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { EmailService } from '../email/email.service';
import { ValidarContatoComercialDto } from './dto/validar-contato-comercial.dto';

export type ContatoComercialValidadoResponse = {
  mensagem: string;
  protocolo: string;
  validadoEm: string;
};

@Injectable()
export class ContatoComercialService {
  private readonly logger = new Logger(ContatoComercialService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async enviarContato(
    dto: ValidarContatoComercialDto,
  ): Promise<ContatoComercialValidadoResponse> {
    this.validarDataPrevista(dto.dataPrevista);

    const protocolo = randomUUID().slice(0, 8).toUpperCase();
    const destinatario = this.configService.getOrThrow<string>('SMTP_TO');

    await this.emailService.enviarEmail({
      para: destinatario,
      assunto: `Novo contato comercial - InfluMatch (${protocolo})`,
      texto: this.montarTextoEmail(dto, protocolo),
      html: this.montarHtmlEmail(dto, protocolo),
    });

    this.logger.log(
      `Contato comercial enviado. Tipo de documento: ${dto.tipoDocumento}. Protocolo: ${protocolo}`,
    );

    return {
      mensagem: 'Contato comercial enviado com sucesso.',
      protocolo,
      validadoEm: new Date().toISOString(),
    };
  }

  validarContato(
    dto: ValidarContatoComercialDto,
  ): ContatoComercialValidadoResponse {
    this.validarDataPrevista(dto.dataPrevista);

    const protocolo = randomUUID().slice(0, 8).toUpperCase();

    return {
      mensagem: 'Dados comerciais validados com sucesso.',
      protocolo,
      validadoEm: new Date().toISOString(),
    };
  }

  private validarDataPrevista(data: string): void {
    const dataPrevista = new Date(`${data}T00:00:00`);

    if (Number.isNaN(dataPrevista.getTime())) {
      throw new BadRequestException('Data prevista inválida.');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataPrevista < hoje) {
      throw new BadRequestException(
        'Data prevista não pode ser anterior à data atual.',
      );
    }
  }

  private montarTextoEmail(
    dto: ValidarContatoComercialDto,
    protocolo: string,
  ): string {
    return `
Novo contato comercial recebido pelo InfluMatch.

Protocolo: ${protocolo}

Nome: ${dto.nome}
E-mail: ${dto.email}
Telefone: ${dto.telefone}
Tipo de documento: ${dto.tipoDocumento}
Documento: ${dto.documento}
CEP: ${dto.cep}
Data prevista: ${dto.dataPrevista}

Mensagem:
${dto.mensagem}
`;
  }

  private montarHtmlEmail(
    dto: ValidarContatoComercialDto,
    protocolo: string,
  ): string {
    return `
      <h2>Novo contato comercial - InfluMatch</h2>

      <p><strong>Protocolo:</strong> ${protocolo}</p>

      <hr />

      <p><strong>Nome:</strong> ${dto.nome}</p>
      <p><strong>E-mail:</strong> ${dto.email}</p>
      <p><strong>Telefone:</strong> ${dto.telefone}</p>
      <p><strong>Tipo de documento:</strong> ${dto.tipoDocumento}</p>
      <p><strong>Documento:</strong> ${dto.documento}</p>
      <p><strong>CEP:</strong> ${dto.cep}</p>
      <p><strong>Data prevista:</strong> ${dto.dataPrevista}</p>

      <hr />

      <p><strong>Mensagem:</strong></p>
      <p>${dto.mensagem}</p>
    `;
  }
}
