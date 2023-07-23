import { ConfigService } from '@nestjs/config';
import { TelegramOptions } from '../telegram/types';

export const getTelegramConfig = (
  configService: ConfigService,
): TelegramOptions => {
  return {
    chatId: configService.get('TG_CHAT_ID'),
    token: configService.get('TG_BOT_TOKEN'),
  };
};
