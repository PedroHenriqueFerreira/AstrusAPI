import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './shared/database/database.config';
import { UserModule } from './user/user.module';
import { GraduationModule } from './graduation/graduation.module';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    GraduationModule,
    AvatarModule,
  ],
})
export class AppModule {}
