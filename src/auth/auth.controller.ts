import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { UserEmailFromJwt } from '../decorators/user-email.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('/login')
  @HttpCode(200)
  async login(@Body() dto: AuthDto) {
    return this.authService.loginWithValidation(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async register(@Body() dto: AuthDto) {
    return this.authService.registerWithValidation(dto);
  }

  @UseGuards(new JwtGuard())
  @Delete('/deleteAccount')
  async deleteAccount(@UserEmailFromJwt() email: string) {
    return this.authService.deleteUserByEmail(email);
  }
}
