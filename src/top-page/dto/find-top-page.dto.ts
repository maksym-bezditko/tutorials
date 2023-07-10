import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

export class FindTopPageDto {
  @ApiProperty({ enum: TopLevelCategory })
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;
}
