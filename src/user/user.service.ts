import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user.entity';
import { Avatar } from '../avatar/avatar.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtTokenService } from 'src/shared/jwt/jwt-token.service';
import { IJwtPayload } from 'src/shared/jwt/jwt.interface';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Graduation } from 'src/graduation/graduation.entity';
import { Role } from 'src/shared/roles/roles.enum';

@Injectable()
export class UserService {
  constructor(
    private jwtTokenService: JwtTokenService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>,
    @InjectRepository(Graduation)
    private graduationRepository: Repository<Graduation>,
  ) {}

  async checkAvatarId(avatarId?: number) {
    if (!avatarId) return;

    const avatarExists = await this.avatarRepository.findOne({
      where: { id: avatarId },
      select: ['id'],
    });

    if (!avatarExists) {
      throw new NotFoundException('ID do avatar não encontrado');
    }
  }

  async checkEmail(email?: string, id?: number) {
    if (!email) return;

    const userExists = await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'email'],
    });

    if (userExists && userExists.id !== id) {
      throw new BadRequestException('Este email já está em uso');
    }
  }

  async checkPassword(password?: string, hash?: string) {
    if (!password || !hash) return;

    const isPasswordCorrect = await compare(password, hash);

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Senha inválida');
    }
  }

  checkUpdatePassword(password?: string, newPassword?: string) {
    if (!password && !newPassword) return;

    if (!password && newPassword) {
      throw new BadRequestException(
        'Para alterar a senha é necessário informar a senha atual',
      );
    }

    if (password && !newPassword) {
      throw new BadRequestException(
        'Para alterar a senha é necessário informar a nova senha',
      );
    }

    if (password === newPassword) {
      throw new BadRequestException(
        'A nova senha não pode ser igual a senha atual',
      );
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    await this.checkEmail(registerUserDto.email);
    await this.checkAvatarId(registerUserDto.avatarId);

    const isAdminEmail = process.env.EMAIL_ADMIN === registerUserDto.email;

    const newUser = this.userRepository.create({
      ...registerUserDto,
      role: isAdminEmail ? Role.ADMIN : Role.USER,
      avatar: { id: registerUserDto.avatarId || null },
    });

    await this.userRepository.save(newUser);

    return { success: true };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'email', 'password', 'isVerified'],
    });

    if (!user) {
      throw new ForbiddenException('Email não cadastrado');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Email não verificado');
    }

    await this.checkPassword(loginUserDto.password, user.password);

    const token = this.jwtTokenService.generateToken(user);

    return { token };
  }

  async update(user: Express.User, updateUserDto: UpdateUserDto) {
    const myUser = user as User;

    await this.checkEmail(updateUserDto.email, myUser.id);
    await this.checkAvatarId(updateUserDto.avatarId);
    await this.checkPassword(updateUserDto.password, myUser.password);
    this.checkUpdatePassword(updateUserDto.password, updateUserDto.newPassword);

    const updatedUser = this.userRepository.create({
      ...updateUserDto,
      password: updateUserDto.newPassword || null,
      avatar: { id: updateUserDto.avatarId || null },
    });

    if (!updatedUser.password) delete updatedUser.password;
    if (!updatedUser.avatar.id) delete updatedUser.avatar;

    await this.userRepository.update(myUser.id, updatedUser);

    return { success: true };
  }

  async delete(user: Express.User, deleteUserDto: DeleteUserDto) {
    const myUser = user as User;

    await this.checkPassword(deleteUserDto.password, myUser.password);
    await this.userRepository.softDelete(myUser.id);

    if (myUser.graduation) {
      await this.graduationRepository.softDelete(myUser.graduation.id);
    }

    return { success: true };
  }

  async findMe(user: Express.User) {
    return { user };
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['avatar', 'graduation'],
      withDeleted: true,
    });

    return { users };
  }

  async findByJwt(where: IJwtPayload) {
    return await this.userRepository.findOne({
      where,
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
      relations: ['graduation'],
    });
  }
}
