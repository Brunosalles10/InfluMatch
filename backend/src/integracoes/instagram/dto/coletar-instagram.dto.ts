import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ColetarInstagramDto {
  @IsString({ message: 'Termo deve ser um texto.' })
  @IsNotEmpty({ message: 'Termo é obrigatório.' })
  @MaxLength(100, { message: 'Termo deve ter no máximo 100 caracteres.' })
  @Transform(({ value }) => value?.trim())
  termo!: string;

  @IsOptional()
  @IsString({ message: 'Nicho deve ser um texto.' })
  @MaxLength(100, { message: 'Nicho deve ter no máximo 100 caracteres.' })
  @Transform(({ value }) => value?.trim())
  nicho?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Quantidade de resultados deve ser um número inteiro.' })
  @Min(1, { message: 'Quantidade de resultados deve ser no mínimo 1.' })
  @Max(25, {
    message:
      'Quantidade de resultados deve ser no máximo 25 para preservar a API.',
  })
  quantidadeResultados?: number = 10;
}
