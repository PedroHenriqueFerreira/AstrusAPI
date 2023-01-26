import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Public } from '../shared/public/public.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { VerificateEmailDto } from './dto/verificate-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/send-verification')
  @Public()
  async sendVerification(@Body() sendEmailDto: SendEmailDto) {
    return await this.emailService.sendVerification(sendEmailDto);
  }

  @Delete('/verificate')
  @Public()
  async verificate(@Body() verificateEmailDto: VerificateEmailDto) {
    return await this.emailService.verificate(verificateEmailDto);
  }

  @Post('/send-reset-password')
  @Public()
  async sendResetPassword(@Body() sendEmailDto: SendEmailDto) {
    return await this.emailService.sendResetPassword(sendEmailDto);
  }

  @Delete('/reset-password')
  @Public()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.emailService.resetPassword(resetPasswordDto);
  }
}
