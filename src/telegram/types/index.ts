import { ModuleMetadata } from '@nestjs/common';

export type TelegramOptions = {
  chatId: string;
  token: string;
};

export interface TelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<TelegramOptions> | TelegramOptions;
  inject?: any[];
}
