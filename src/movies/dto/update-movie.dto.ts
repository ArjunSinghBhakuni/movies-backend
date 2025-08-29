import { IsInt, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateMovieDto {
@ApiPropertyOptional() @IsOptional() name?: string;
@ApiPropertyOptional() @IsOptional() image?: string;
@ApiPropertyOptional() @IsOptional() @IsInt() year?: number;
@ApiPropertyOptional() @IsOptional() @IsInt() genreId?: number;
@ApiPropertyOptional() @IsOptional() @IsString() detail?: string;
@ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() cast?: string[];
}