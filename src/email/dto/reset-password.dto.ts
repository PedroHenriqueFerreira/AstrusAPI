import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @Length(64, 64, { message: 'O código de recuperação deve ter 64 caracteres' })
  @IsString({ message: 'O código de recuperação precisa ser uma string' })
  @IsNotEmpty({ message: 'O código de recuperação é um campo obrigatório' })
  code: string;

  @IsInt({ message: 'O ID do usuário precisa ser um número' })
  @IsNotEmpty({ message: 'O ID do usuário é um campo obrigatório' })
  userId: number;

  @Length(8, 64, { message: 'A senha deve ter entre 8 e 64 caracteres' })
  @IsString({ message: 'A senha precisa ser uma string' })
  @IsNotEmpty({ message: 'A senha é um campo obrigatório' })
  password: string;
}
