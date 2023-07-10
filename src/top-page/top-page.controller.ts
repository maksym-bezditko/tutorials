import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Top Page')
@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Post('create')
  @UseGuards(new JwtGuard())
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.topPageService.validateAndFindById(id);
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    return this.topPageService.findByAlias(alias);
  }

  @UseGuards(new JwtGuard())
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.topPageService.deleteById(id);
  }

  @UseGuards(new JwtGuard())
  @ApiBearerAuth()
  @Patch(':id')
  async patch(
    @Body() dto: CreateTopPageDto,
    @Param('id', IdValidationPipe) id: string,
  ) {
    return this.topPageService.updateById(id, dto);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('find-by-first-category')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByFirstCategory(dto);
  }

  @HttpCode(200)
  @Get('search/:text')
  async searchByText(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }
}
