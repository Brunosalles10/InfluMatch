import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;
}
