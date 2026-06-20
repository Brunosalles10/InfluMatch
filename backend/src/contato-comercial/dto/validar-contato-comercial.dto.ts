import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsDocumentoBrasileiroValido } from '../../common/decorators/documento-brasileiro-valido.decorator';
import { removerMascaraNumerica } from '../../common/utils/documentos-brasileiros.util';

export enum TipoDocumentoContato {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

export class ValidarContatoComercialDto {
  @ApiProperty({ example: 'joão da silva' })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres.' })
  @Transform(({ value }) => value?.trim())
  nome!: string;

  @ApiProperty({ example: 'contato@empresa.com' })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail({}, { message: 'Email inválido.' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @ApiProperty({ example: '(44) 99999-9999' })
  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @Transform(({ value }) => removerMascaraNumerica(value))
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos.',
  })
  telefone!: string;

  @ApiProperty({
    enum: TipoDocumentoContato,
    example: TipoDocumentoContato.CNPJ,
  })
  @IsEnum(TipoDocumentoContato, {
    message: 'Tipo de documento deve ser CPF ou CNPJ.',
  })
  tipoDocumento!: TipoDocumentoContato;

  @ApiProperty({ example: '00.000.000/0000-00' })
  @IsNotEmpty({ message: 'Documento é obrigatório.' })
  @Transform(({ value }) => removerMascaraNumerica(value))
  @IsDocumentoBrasileiroValido({
    message: 'Documento inválido para o tipo selecionado.',
  })
  documento!: string;

  @ApiProperty({ example: '87360-000' })
  @IsNotEmpty({ message: 'CEP é obrigatório.' })
  @Transform(({ value }) => removerMascaraNumerica(value))
  @Matches(/^\d{8}$/, {
    message: 'CEP deve conter 8 dígitos.',
  })
  cep!: string;

  @ApiProperty({ example: '2026-07-20' })
  @IsNotEmpty({ message: 'Data prevista é obrigatória.' })
  @IsDateString({}, { message: 'Data prevista inválida.' })
  dataPrevista!: string;

  @ApiProperty({
    example:
      'Tenho interesse em encontrar criadores para uma campanha no nicho de tecnologia.',
  })
  @IsNotEmpty({ message: 'Mensagem é obrigatória.' })
  @MinLength(10, { message: 'Mensagem deve ter no mínimo 10 caracteres.' })
  @MaxLength(500, { message: 'Mensagem deve ter no máximo 500 caracteres.' })
  @Transform(({ value }) => value?.trim())
  mensagem!: string;
}
