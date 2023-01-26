import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Length } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @Length(8, 64, { message: 'A nova senha deve ter entre 8 e 64 caracteres' })
  @IsString({ message: 'A nova senha precisa ser uma string' })
  @IsOptional()
  newPassword: string;

  password: string;
}
