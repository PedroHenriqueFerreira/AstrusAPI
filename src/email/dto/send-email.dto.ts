import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { message: 'Este email é inválido' })
  @Length(3, 64, { message: 'O email deve ter entre 3 e 64 caracteres' })
  @IsString({ message: 'O email precisa ser uma string' })
  @IsNotEmpty({ message: 'O email é um campo obrigatório' })
  email: string;
}
