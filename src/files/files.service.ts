import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFormat = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFormat}`;

    await ensureDir(uploadFolder);

    const response: FileElementResponse[] = [];

    for (const file of files) {
      const uploadPath = `${uploadFolder}/${file.originalname}`;

      const savedItemPath = `${dateFormat}/${file.originalname}`;

      await writeFile(uploadPath, file.buffer);

      response.push({
        url: savedItemPath,
        name: file.originalname,
      });
    }

    return response;
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
