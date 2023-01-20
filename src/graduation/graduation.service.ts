import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { RegisterGraduationDto } from './dto/register-graduation.dto';
import { Graduation } from './graduation.entity';

@Injectable()
export class GraduationService {
  constructor(
    @InjectRepository(Graduation)
    private graduationRepository: Repository<Graduation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(
    registerGraduationDto: RegisterGraduationDto,
    docFile: Express.Multer.File,
    docOptionalFile?: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: registerGraduationDto.userId },
      select: {
        id: true,
        graduation: {
          id: true,
        },
      },
      relations: {
        graduation: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('ID do usuário inválido');
    }

    if (user.graduation) {
      throw new ForbiddenException('Este usuário já possui graduação');
    }

    const graduation = this.graduationRepository.create({
      ...registerGraduationDto,
      docUrl: docFile.filename,
      optionalDocUrl: docOptionalFile?.filename,
    });

    await this.graduationRepository.save(graduation);

    user.graduation = graduation;

    await this.userRepository.save(user);

    return { success: true };
  }
}
