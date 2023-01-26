import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerModuleOptions } from '../shared/multer/multer.config';
import { RequiredFilesPipe } from '../shared/files/files.pipe';
import { RegisterGraduationDto } from './dto/register-graduation.dto';
import { GraduationService } from './graduation.service';
import { Roles } from 'src/shared/roles/roles.decorator';
import { Role } from 'src/shared/roles/roles.enum';

@Controller('graduation')
export class GraduationController {
  constructor(private graduationService: GraduationService) {}

  @Post('/register')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'docFile', maxCount: 1 },
        { name: 'optionalDocFile', maxCount: 1 },
      ],
      multerModuleOptions(['JPG', 'PNG']),
    ),
  )
  async register(
    @Req() { user }: Express.Request,
    @Body() registerGraduationDto: RegisterGraduationDto,
    @UploadedFiles(
      new RequiredFilesPipe([
        {
          name: 'docFile',
          validateMessage: 'O documento é obrigatório',
        },
      ]),
    )
    files: {
      docFile: Express.Multer.File[];
      optionalDocFile: Express.Multer.File[];
    },
  ) {
    return await this.graduationService.register(
      user,
      registerGraduationDto,
      files.docFile[0],
      files.optionalDocFile?.[0],
    );
  }

  @Put('/accept/:id')
  @Roles(Role.ADMIN)
  async accept(@Param('id') id: number) {
    return await this.graduationService.accept(id);
  }

  @Delete('/refuse/:id')
  @Roles(Role.ADMIN)
  async refuse(@Param('id') id: number) {
    return await this.graduationService.refuse(id);
  }

  @Get('/all')
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.graduationService.findAll();
  }
}
