import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CriarNichoDto {
  @IsNotEmpty({ message: 'Nome do nicho é obrigatório.' })
  @MinLength(2, { message: 'Nome do nicho deve ter no mínimo 2 caracteres.' })
  @MaxLength(80, { message: 'Nome do nicho deve ter no máximo 80 caracteres.' })
  @Transform(({ value }) => value?.trim())
  nome!: string;
}
