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
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(new JwtGuard())
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.productService.findById(id);
  }

  @Delete(':id')
  @UseGuards(new JwtGuard())
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.productService.deleteById(id);
  }

  @UseGuards(new JwtGuard())
  @Patch(':id')
  async patch(
    @Body() dto: CreateProductDto,
    @Param('id', IdValidationPipe) id: string,
  ) {
    return this.productService.updateById(id, dto);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
