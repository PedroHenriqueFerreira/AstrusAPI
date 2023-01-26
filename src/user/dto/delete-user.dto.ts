import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

export class DeleteUserDto extends PickType(RegisterUserDto, [
  'password',
] as const) {
  @Length(8, 128, { message: 'O nome deve ter entre 8 e 128 caracteres' })
  @IsString({ message: 'O nome preica ser uma string' })
  @IsNotEmpty({ message: 'A razão é obrigatória' })
  readonly reason: string;
}
