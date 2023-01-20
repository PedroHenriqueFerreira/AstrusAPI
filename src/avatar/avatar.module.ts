import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './avatar.entity';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule {}
