import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Este email é inválido' })
  @Length(3, 64, { message: 'O email deve ter entre 3 e 64 caracteres' })
  @IsString({ message: 'O email precisa ser uma string' })
  @IsNotEmpty({ message: 'O email é um campo obrigatório' })
  email: string;

  @Length(8, 64, { message: 'O nome deve ter entre 3 e 64 caracteres' })
  @IsString({ message: 'A senha precisa ser uma string' })
  @IsNotEmpty({ message: 'O email é um campo obrigatório' })
  password: string;
}
