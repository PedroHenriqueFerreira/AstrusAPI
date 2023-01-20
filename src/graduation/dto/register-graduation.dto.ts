import {
  Contains,
  IsNotEmpty,
  IsString,
  NotEquals,
  IsNumberString,
} from 'class-validator';

export class RegisterGraduationDto {
  @IsNumberString({ message: 'O ID da graduação precisa ser um número' })
  @IsNotEmpty({ message: 'O ID da graduação é obrigatório' })
  readonly userId: number;

  @NotEquals('lattes.cnpq.br/', { message: 'A URL do lattes é inválida' })
  @Contains('lattes.cnpq.br/', { message: 'A URL do lattes é inválida' })
  @IsString({ message: 'A URL do lattes precisa ser uma string' })
  @IsNotEmpty({ message: 'A URL do lattes é obrigatória' })
  readonly lattesUrl: string;
}
