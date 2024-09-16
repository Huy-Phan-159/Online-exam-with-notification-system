import { Controller, Post, UploadedFile, UseInterceptors, Param, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/entities/enums/role.enum';

@Roles(Role.TEACHER)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':param')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() req, @UploadedFile() file: Express.Multer.File, @Param('param') param: string) {
    const user = req.user.id;
    const results = [];
    const stream = Readable.from(file.buffer.toString());
    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const response = await this.filesService.createFromCsv(results, param, user);
            resolve({ success: true, message: 'File processed successfully', data: response });
          } catch (error) {
            reject({ success: false, message: 'File processing failed', error });
          }
        })
        .on('error', (error) => reject({ success: false, message: 'File processing failed', error }));
    });
  }
}
