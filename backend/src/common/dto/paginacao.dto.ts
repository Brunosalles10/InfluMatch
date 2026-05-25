import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginacaoDto {
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
