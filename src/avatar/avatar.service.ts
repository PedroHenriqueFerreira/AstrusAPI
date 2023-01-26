import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar } from './avatar.entity';
import { unlink } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private avatarRepository: Repository<Avatar>,
  ) {}

  async create(image: Express.Multer.File) {
    const avatar = this.avatarRepository.create({
      imageUrl: image.filename,
    });

    await this.avatarRepository.save(avatar);

    return { success: true };
  }

  async getAll() {
    const avatars = await this.avatarRepository.find();
    return { avatars };
  }

  async delete(id: number) {
    const avatar = await this.avatarRepository.findOne({
      where: { id },
      select: ['id', 'imageUrl'],
    });

    if (!avatar) {
      throw new NotFoundException('ID do avatar não encontrado');
    }

    try {
      await unlink(resolve(__dirname, '..', '..', 'uploads', avatar.imageUrl));
    } catch (error) {
      console.error(error);

      // throw new BadRequestException('Não foi possível deletar o avatar');
    }

    await this.avatarRepository.delete(id);

    return { success: true };
  }
}
