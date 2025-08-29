import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
@ApiProperty() @IsNotEmpty() username: string;
@ApiProperty() @IsEmail() email: string;
@ApiProperty() @MinLength(6) password: string;
}