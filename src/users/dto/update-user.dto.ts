import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateUserDto {
@ApiPropertyOptional() @IsOptional() @IsString() username?: string;
@ApiPropertyOptional() @IsOptional() @MinLength(6) password?: string;
}