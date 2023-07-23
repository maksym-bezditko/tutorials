import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @HttpCode(200)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('files'))
  @UseGuards(new JwtGuard())
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const savedFiles: MFile[] = [new MFile(file)];

    if (file.mimetype.includes('image')) {
      const webp = await this.filesService.convertToWebP(file.buffer);

      savedFiles.push(
        new MFile({
          originalname: file.originalname.split('.')[0] + '.webp',
          buffer: webp,
        }),
      );
    }

    return this.filesService.saveFiles(savedFiles);
  }
}
