import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

export class HHDataDto {
  @ApiProperty()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsNumber()
  juniorSalary: number;

  @ApiProperty()
  @IsNumber()
  middleSalary: number;

  @ApiProperty()
  @IsNumber()
  seniorSalary: number;
}

export class TopPageDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @ApiProperty({ enum: TopLevelCategory })
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @ApiProperty()
  @IsString()
  secondCategory: string;

  @ApiProperty()
  @IsString()
  alias: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiPropertyOptional({ type: HHDataDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => HHDataDto)
  hh?: HHDataDto;

  @ApiProperty({ type: [TopPageDto] })
  @IsArray()
  @Type(() => TopPageDto)
  @ValidateNested({ each: true })
  advantages: TopPageDto[];

  @ApiProperty()
  @IsString()
  seoText: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  tagsTitle: string;
}
