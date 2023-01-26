import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { EmailController } from './email.controller';
import { Email } from './email.entity';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Email])],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
