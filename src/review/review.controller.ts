import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TelegramService } from '../telegram/telegram.service';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService,
  ) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(new JwtGuard())
  @ApiBearerAuth()
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(new JwtGuard())
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.reviewService.delete(id);
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @Post('/notify')
  async notify() {
    const allReviews = await this.reviewService.getAll();

    for (const review of allReviews) {
      const message = `Name: ${review.name}\n\nTitle: ${review.title}\n\nDescription: ${review.description}\n\nRating: ${review.rating}\n\nProductId: ${review.productId}`;

      await this.telegramService.sendMessage(message);
    }
  }
}
