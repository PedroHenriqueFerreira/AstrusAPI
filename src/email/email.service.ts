import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import Mail from 'nodemailer/lib/mailer';
import {
  EMAIL_EXPIRES_TIMEOUT,
  EMAIL_RESEND_INTERVAL,
  transporter,
} from 'src/shared/email/email.config';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { SendEmailDto } from './dto/send-email.dto';
import { VerificateEmailDto } from './dto/verificate-email.dto';
import { Email } from './email.entity';
import { EmailEnum } from './email.enum';

import { randomBytes } from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Email) private emailRepository: Repository<Email>,
  ) {}

  getTypeName(type: EmailEnum) {
    return type === EmailEnum.VERIFICATION ? 'verificação' : 'recuperação';
  }

  getVerificationCode() {
    return Math.random().toString(10).substring(2, 10);
  }

  getResetPasswordCode() {
    return randomBytes(32).toString('hex');
  }

  async checkCode(code: string, hash: string, type: EmailEnum) {
    const codeIsCorrect = await compare(code, hash);

    if (!codeIsCorrect) {
      throw new UnauthorizedException(
        `Código de ${this.getTypeName(type)} inválido`,
      );
    }
  }

  sendEmail(options: Mail.Options) {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      transporter.sendMail(
        { ...options, from: `"Astrus" <${process.env.EMAIL_ADMIN}>` },
        async (error) => {
          if (!error) resolve({ success: true });

          return reject(error);
        },
      );
    });
  }

  async createOrUpdateEmail(
    code: string,
    userId: number,
    type: EmailEnum,
    sendEmailDto: SendEmailDto,
  ) {
    const email = await this.emailRepository.findOne({
      where: {
        type,
        user: { id: userId },
      },
      select: {
        id: true,
        type: true,
        updatedAt: true,
        user: { id: true },
      },
      relations: ['user'],
    });

    if (email) {
      if (email.updatedAt > new Date(Date.now() - EMAIL_RESEND_INTERVAL)) {
        throw new BadRequestException(
          `Código de ${this.getTypeName(type)} já enviado`,
        );
      }

      const newEmail = this.emailRepository.create({ code });

      await this.emailRepository.update(email.id, newEmail);
    } else {
      const newEmail = this.emailRepository.create({
        ...sendEmailDto,
        code,
        type,
        user: { id: userId },
      });

      await this.emailRepository.save(newEmail);
    }
  }

  async sendVerification(sendEmailDto: SendEmailDto) {
    const user = await this.userRepository.findOne({
      where: { email: sendEmailDto.email },
      select: ['id', 'isVerified'],
    });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email já verificado');
    }

    const verificationCode = this.getVerificationCode();

    await this.createOrUpdateEmail(
      verificationCode,
      user.id,
      EmailEnum.VERIFICATION,
      sendEmailDto,
    );

    await this.sendEmail({
      to: sendEmailDto.email.toLowerCase(),
      subject: 'Código de confirmação',
      html: `Seu código é: ${verificationCode}`,
    });

    return { success: true };
  }

  async verificate(verificateEmailDto: VerificateEmailDto) {
    const email = await this.emailRepository.findOne({
      where: {
        type: EmailEnum.VERIFICATION,
        user: { email: verificateEmailDto.email },
      },
      select: {
        id: true,
        updatedAt: true,
        code: true,
        user: { id: true, email: true, isVerified: true },
      },
      relations: ['user'],
    });

    if (!email) {
      throw new NotFoundException('Email não encontrado');
    }

    if (email.user.isVerified) {
      throw new BadRequestException('Email já verificado');
    }

    if (email.updatedAt < new Date(Date.now() - EMAIL_EXPIRES_TIMEOUT)) {
      throw new BadRequestException('Código de verificação expirado');
    }

    await this.checkCode(
      verificateEmailDto.code,
      email.code,
      EmailEnum.VERIFICATION,
    );

    await this.userRepository.update(email.user.id, { isVerified: true });
    await this.emailRepository.delete(email.id);

    return { success: true };
  }

  async sendResetPassword(sendEmailDto: SendEmailDto) {
    const user = await this.userRepository.findOne({
      where: { email: sendEmailDto.email },
      select: ['email', 'id'],
    });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
    }

    const code = this.getResetPasswordCode();

    await this.createOrUpdateEmail(
      code,
      user.id,
      EmailEnum.RESET_PASSWORD,
      sendEmailDto,
    );

    await this.sendEmail({
      to: sendEmailDto.email.toLowerCase(),
      subject: 'Redefinir senha',
      html: `
        Para redefinir sua senha

        <a href="http://localhost:3000/reset-password?code=${code}&userId=${user.id}">
          clique aqui
        </a>
      `,
    });

    return { success: true };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const email = await this.emailRepository.findOne({
      where: {
        type: EmailEnum.RESET_PASSWORD,
        user: { id: resetPasswordDto.userId },
      },
      select: {
        id: true,
        updatedAt: true,
        code: true,
        user: { id: true, email: true },
      },
      relations: ['user'],
    });

    if (!email) {
      throw new NotFoundException('Email não encontrado');
    }

    if (email.updatedAt < new Date(Date.now() - EMAIL_EXPIRES_TIMEOUT)) {
      throw new BadRequestException('Código de recuperação expirado');
    }

    await this.checkCode(
      resetPasswordDto.code,
      email.code,
      EmailEnum.RESET_PASSWORD,
    );

    const newUser = this.userRepository.create({
      password: resetPasswordDto.password,
    });

    await this.userRepository.update(email.user.id, newUser);
    await this.emailRepository.delete(email.id);

    return { success: true };
  }
}
