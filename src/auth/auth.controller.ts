import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Get()
  async login(@Body() dto: AuthDto) {}

  @HttpCode(200)
  @Post('/register')
  async register(@Body() dto: AuthDto) {}
}
