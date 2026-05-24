import { Plataforma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListarPerfisSociaisDto {
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Plataforma, { message: 'Plataforma inválida.' })
  plataforma?: Plataforma;

  @IsOptional()
  @IsString({ message: 'Busca deve ser um texto.' })
  @MaxLength(100, { message: 'Busca deve ter no máximo 100 caracteres.' })
  @Transform(({ value }) => value?.trim())
  busca?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro.' })
  @Min(1, { message: 'Página deve ser no mínimo 1.' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro.' })
  @Min(1, { message: 'Limite deve ser no mínimo 1.' })
  @Max(50, { message: 'Limite deve ser no máximo 50.' })
  limit?: number = 10;
}
