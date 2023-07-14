import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { TopPageModule } from 'src/top-page/top-page.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TopPageModule, ConfigModule],
  controllers: [SitemapController],
})
export class SitemapModule {}
