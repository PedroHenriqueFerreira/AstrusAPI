import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { compare, compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user.entity';
import { sign } from 'jsonwebtoken';
import { Avatar } from '../avatar/avatar.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { generateUserToken } from 'src/shared/database/utils/generate-user-token';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const userExists = await this.userRepository.findOne({
      where: {
        email: registerUserDto.email,
        isVerified: true,
      },
      select: ['email', 'isVerified'],
    });

    if (userExists) {
      throw new BadRequestException('Este email já está em uso');
    }

    const avatarExists = await this.avatarRepository.findOne({
      where: { id: registerUserDto.avatarId },
      select: ['id'],
    });

    if (!avatarExists) {
      throw new BadRequestException('ID do avatar inválido');
    }

    const newUser = this.userRepository.create({
      ...registerUserDto,
      avatar: { id: registerUserDto.avatarId },
    });

    await this.userRepository.save(newUser);

    const token = generateUserToken(newUser.id);

    return { token };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
        isVerified: true,
      },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new ForbiddenException('Email não cadastrado ou não verificado');
    }

    const isPasswordCorrect = await compareSync(
      user.password,
      loginUserDto.password,
    );

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Senha incorreta');
    }

    const token = generateUserToken(user.id);

    return { token };
  }

  async getAll() {
    const users = await this.userRepository.find({
      loadRelationIds: true,
    });

    return { users };
  }
}
