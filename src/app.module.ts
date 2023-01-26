import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './shared/database/database.config';
import { UserModule } from './user/user.module';
import { GraduationModule } from './graduation/graduation.module';
import { AvatarModule } from './avatar/avatar.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/jwt/jwt-auth.guard';
import { RolesGuard } from './shared/roles/roles.guard';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    GraduationModule,
    AvatarModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
