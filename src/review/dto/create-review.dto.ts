import { IsNumber, IsString, Max, Min, IsHexadecimal } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5)
  @Min(1)
  @IsNumber()
  rating: number;

  @IsHexadecimal()
  productId: string;
}
