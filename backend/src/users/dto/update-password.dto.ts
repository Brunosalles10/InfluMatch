import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  currentPassword!: string;

  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @MinLength(8, { message: 'Senha deve conter no mínimo 8 caracteres' })
  @MaxLength(20, { message: 'Senha deve conter no máximo 20 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    {
      message:
        'Senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    },
  )
  newPassword!: string;
}
