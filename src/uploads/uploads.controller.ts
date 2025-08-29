import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipeBuilder } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadParamsDto } from './dto/upload-params.dto';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Uploads')
@Controller('api/v1/upload')
export class UploadsController {
constructor(private readonly uploadsService: UploadsService) {}

@Post()
@ApiOperation({ summary: 'Upload a single image to S3' })
@UseInterceptors(FileInterceptor('image'))
async uploadSingle(
@UploadedFile(new ParseFilePipeBuilder()
.addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/i })
.addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
.build({ errorHttpStatusCode: 400, fileIsRequired: true }),
)
file: Express.Multer.File,
@Body() body: UploadParamsDto,
): Promise<UploadResponseDto> {
return this.uploadsService.uploadImage(file, { folder: body.folder, makePublic: body.makePublic });
}
}