import { Contains, IsNotEmpty, IsString, NotEquals } from 'class-validator';

export class RegisterGraduationDto {
  @NotEquals('lattes.cnpq.br/', { message: 'A URL do lattes é inválida' })
  @Contains('lattes.cnpq.br/', { message: 'A URL do lattes é inválida' })
  @IsString({ message: 'A URL do lattes precisa ser uma string' })
  @IsNotEmpty({ message: 'A URL do lattes é obrigatória' })
  readonly lattesUrl: string;
}
