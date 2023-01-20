import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { GraduationController } from './graduation.controller';
import { Graduation } from './graduation.entity';
import { GraduationService } from './graduation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Graduation, User])],
  controllers: [GraduationController],
  providers: [GraduationService],
})
export class GraduationModule {}
