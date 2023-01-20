import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/avatar/avatar.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
