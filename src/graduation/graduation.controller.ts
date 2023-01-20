import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerModuleOptions } from '../shared/multer/multer.config';
import { RequiredFilesPipe } from '../shared/pipe/required-files.pipe';
import { RegisterGraduationDto } from './dto/register-graduation.dto';
import { GraduationService } from './graduation.service';

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
      registerGraduationDto,
      files.docFile[0],
      files.optionalDocFile?.[0],
    );
  }
}
