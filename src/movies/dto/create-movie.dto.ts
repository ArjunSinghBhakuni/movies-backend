import { IsInt, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMovieDto {
@ApiProperty() @IsNotEmpty() name: string;
@ApiProperty({ required: false }) @IsOptional() image?: string;
@ApiProperty() @IsInt() year: number;
@ApiProperty() @IsInt() genreId: number;
@ApiProperty() @IsString() detail: string;
@ApiProperty({ type: [String] }) @IsArray() cast: string[];
}