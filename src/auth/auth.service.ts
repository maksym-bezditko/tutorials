import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './auth.model';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  USER_ALREADY_REGISTERED_ADVICE,
  USER_ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ADVICE,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ADVICE,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto): Promise<DocumentType<UserModel>> {
    const salt = await genSalt(10);

    return this.userModel.create({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
  }

  async findUser(email: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validate(dto: AuthDto) {
    const user = await this.userModel.findOne({ email: dto.login }).exec();

    if (!user) {
      throw new UnauthorizedException(
        USER_NOT_FOUND_ERROR,
        USER_NOT_FOUND_ADVICE,
      );
    }

    const isPasswordValid = await compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        WRONG_PASSWORD_ERROR,
        WRONG_PASSWORD_ADVICE,
      );
    }

    return {
      email: user.email,
    };
  }

  async registerWithValidation(authDto: AuthDto) {
    const oldUser = await this.findUser(authDto.login);

    if (oldUser) {
      throw new BadRequestException(
        USER_ALREADY_REGISTERED_ERROR,
        USER_ALREADY_REGISTERED_ADVICE,
      );
    }

    return this.createUser(authDto);
  }

  async loginWithValidation(authDto: AuthDto) {
    const { email } = await this.validate(authDto);

    const payload = { email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async deleteUserByEmail(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }
}
