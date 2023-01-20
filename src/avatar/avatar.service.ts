import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar } from './avatar.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private graduationRepository: Repository<Avatar>,
  ) {}

  async create(image: Express.Multer.File) {
    const avatar = this.graduationRepository.create({
      imageUrl: image.filename,
    });

    await this.graduationRepository.save(avatar);

    return { success: true };
  }

  async getAll() {
    const avatars = await this.graduationRepository.find();
    return { avatars };
  }

  async delete(id: number) {
    await this.graduationRepository.delete(id);

    return { success: true };
  }
}
