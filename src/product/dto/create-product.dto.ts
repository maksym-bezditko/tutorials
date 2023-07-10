import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductCharacteristicDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @ApiProperty()
  @IsNumber()
  credit: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  advantages: string;

  @ApiProperty()
  @IsString()
  disAdvantages: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @ApiProperty({ type: [ProductCharacteristicDto] })
  @ValidateNested()
  @IsArray()
  @Type(() => ProductCharacteristicDto)
  characteristics: ProductCharacteristicDto[];
}
