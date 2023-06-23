import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { ConfigService } from '@nestjs/config';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly configService: ConfigService) {}

  @Post('create')
  async create(@Body() dto: Omit<TopPageModel, '_id'>) {
    return this.configService.get('TEST');
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return '';
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return '';
  }

  @Patch(':id')
  async patch(@Body() dto: TopPageModel, @Param('id') id: string) {
    return '';
  }

  @HttpCode(200)
  @Post()
  async find(@Body('id') dto: FindTopPageDto) {
    return '';
  }
}
