import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from '../avatar/avatar.entity';
import { JwtTokenService } from '../shared/jwt/jwt-token.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/shared/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from 'src/shared/jwt/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { authModuleOptions } from 'src/shared/passport/passport.config';
import { Graduation } from 'src/graduation/graduation.entity';

@Module({
  imports: [
    PassportModule.register(authModuleOptions),
    JwtModule.register(jwtModuleOptions),
    TypeOrmModule.forFeature([User, Avatar, Graduation]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtTokenService],
})
export class UserModule {}
