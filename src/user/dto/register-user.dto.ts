import {
  IsEmail,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegisterUserDto {
  @IsInt({ message: 'O ID do avatar precisa ser um número' })
  @IsOptional()
  readonly avatarId?: number;

  @Length(3, 64, { message: 'O nome deve ter entre 3 e 64 caracteres' })
  @IsString({ message: 'O nome preica ser uma string' })
  @IsNotEmpty({ message: 'O nome é um campo obrigatório' })
  readonly firstName: string;

  @Length(3, 64, { message: 'O sobrenome deve ter entre 3 e 64 caracteres' })
  @IsString({ message: 'O sobrenome precisa ser uma string' })
  @IsNotEmpty({ message: 'O sobrenome é um campo obrigatório' })
  readonly lastName: string;

  @IsEmail({}, { message: 'Este email é inválido' })
  @Length(3, 64, { message: 'O email deve ter entre 3 e 64 caracteres' })
  @IsString({ message: 'O email precisa ser uma string' })
  @IsNotEmpty({ message: 'O email é um campo obrigatório' })
  readonly email: string;

  @Length(8, 64, { message: 'A senha deve ter entre 8 e 64 caracteres' })
  @IsString({ message: 'A senha precisa ser uma string' })
  @IsNotEmpty({ message: 'A senha é um campo obrigatório' })
  readonly password: string;
}
