import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ReviewDto {
@ApiProperty() @IsInt() @Min(1) @Max(5) rating: number;
@ApiProperty() @IsNotEmpty() comment: string;
}