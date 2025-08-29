import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UploadParamsDto {
  @ApiPropertyOptional({ description: 'Optional folder name in S3', example: 'avatars' })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiPropertyOptional({ description: 'If true, file will be uploaded as public-read' })
  @IsOptional()
  @IsBoolean()
  makePublic?: boolean;
}
