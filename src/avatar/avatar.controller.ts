import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerModuleOptions } from '../shared/multer/multer.config';
import { RequiredFilesPipe } from '../shared/pipe/required-files.pipe';
import { AvatarService } from './avatar.service';

@Controller('avatar')
export class AvatarController {
  constructor(private avatarService: AvatarService) {}

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'imageFile', maxCount: 1 }],
      multerModuleOptions(['JPG', 'PNG', 'SVG', 'GIF']),
    ),
  )
  async create(
    @UploadedFiles(
      new RequiredFilesPipe([
        {
          name: 'imageFile',
          validateMessage: 'A imagem é obrigatória',
        },
      ]),
    )
    files: {
      imageFile: Express.Multer.File[];
    },
  ) {
    return await this.avatarService.create(files.imageFile[0]);
  }

  @Get('/all')
  async getAll() {
    return await this.avatarService.getAll();
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.avatarService.delete(id);
  }
}
