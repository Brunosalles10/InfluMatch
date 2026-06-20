import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import type { EnviarEmailParams } from './types/enviar-email.types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: Number(this.configService.getOrThrow<string>('SMTP_PORT')),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  async enviarEmail(params: EnviarEmailParams): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.getOrThrow<string>('SMTP_FROM'),
        to: params.para,
        subject: params.assunto,
        text: params.texto,
        html: params.html,
      });

      this.logger.log(`E-mail enviado com sucesso para: ${params.para}`);
    } catch (error) {
      this.logger.error('Erro ao enviar e-mail.', error);

      throw new ServiceUnavailableException(
        'Não foi possível enviar o e-mail no momento.',
      );
    }
  }
}
