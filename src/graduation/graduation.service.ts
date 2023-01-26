import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { RegisterGraduationDto } from './dto/register-graduation.dto';
import { Graduation } from './graduation.entity';
import { Role } from 'src/shared/roles/roles.enum';

@Injectable()
export class GraduationService {
  constructor(
    @InjectRepository(Graduation)
    private graduationRepository: Repository<Graduation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(
    user: Express.User,
    registerGraduationDto: RegisterGraduationDto,
    docFile: Express.Multer.File,
    docOptionalFile?: Express.Multer.File,
  ) {
    const myUser = user as User;

    if (myUser.graduation) {
      throw new ForbiddenException('Este usuário já possui graduação');
    }

    const newGraduation = this.graduationRepository.create({
      ...registerGraduationDto,
      docUrl: docFile.filename,
      optionalDocUrl: docOptionalFile?.filename,
      user: { id: myUser.id },
    });

    await this.graduationRepository.save(newGraduation);

    return { success: true };
  }

  async accept(id: number) {
    const graduation = await this.graduationRepository.findOne({
      where: { id },
      select: {
        id: true,
        isVerified: true,
        user: {
          id: true,
        },
      },
      relations: ['user'],
    });

    if (!graduation) {
      throw new NotFoundException('ID da graduação não encontrado');
    }

    if (graduation.isVerified) {
      throw new BadRequestException('Esta graduação já foi aceita');
    }

    await this.userRepository.update(graduation.user.id, {
      role: Role.PROFESSOR,
    });

    await this.graduationRepository.update(graduation.id, { isVerified: true });

    return { success: true };
  }

  async refuse(id: number) {
    const graduation = await this.graduationRepository.findOne({
      where: { id },
      select: {
        id: true,
        isVerified: true,
        docUrl: true,
        optionalDocUrl: true,
        user: {
          id: true,
        },
      },
      relations: ['user'],
    });

    if (!graduation) {
      throw new NotFoundException('ID da graduação não encontrado');
    }

    await this.userRepository.update(graduation.user.id, { role: Role.USER });
    await this.graduationRepository.softDelete(graduation.id);

    return { success: true };
  }

  async findAll() {
    const graduations = await this.graduationRepository.find({
      relations: ['user'],
      withDeleted: true,
    });

    return { graduations };
  }
}
