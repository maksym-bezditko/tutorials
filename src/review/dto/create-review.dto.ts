import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min, IsHexadecimal } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsHexadecimal()
  productId: string;
}
