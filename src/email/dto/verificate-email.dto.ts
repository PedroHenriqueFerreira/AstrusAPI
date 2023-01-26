import { IntersectionType } from '@nestjs/mapped-types';

import { IsNotEmpty, IsString, Length } from 'class-validator';
import { SendEmailDto } from './send-email.dto';

export class VerificateEmailDto extends IntersectionType(SendEmailDto) {
  @Length(8, 8, { message: 'O código de verificação deve ter 8 caracteres' })
  @IsString({ message: 'O código de verificação precisa ser uma string' })
  @IsNotEmpty({ message: 'O código de verificação é um campo obrigatório' })
  code: string;
}
