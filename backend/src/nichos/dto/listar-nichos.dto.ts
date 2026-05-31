import { Transform } from 'class-transformer';
import { IsOptional, MaxLength } from 'class-validator';

export class ListarNichosDto {
  @IsOptional()
  @MaxLength(80, { message: 'Busca deve ter no máximo 80 caracteres.' })
  @Transform(({ value }) => value?.trim())
  busca?: string;
}
