import { SitemapUrl } from './types/index';
import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TopPageService } from '../top-page/top-page.service';
import { format, sub } from 'date-fns';
import { Builder } from 'xml2js';
import { RouteMap } from './sitemap.constants';

@Controller('sitemap')
export class SitemapController {
  domain: string;

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = configService.get('DOMAIN') ?? '';
  }

  @Get('xml')
  @Header('Content-Type', 'text/xml')
  async sitemap() {
    const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";

    let res: SitemapUrl[] = [
      {
        loc: this.domain,
        lastmod: format(sub(new Date(), { days: 1 }), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: this.domain + '/courses',
        lastmod: format(sub(new Date(), { days: 1 }), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
    ];

    const allPages = await this.topPageService.findAll();

    res = res.concat(
      allPages.map((item) => ({
        loc: `${this.domain}/${RouteMap[item.firstCategory]}/${item.alias}`,
        lastmod: format(new Date(item.updatedAt), formatString),
        changefreq: 'daily',
        priority: '1.0',
      })),
    );

    const builder = new Builder({
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8',
      },
    });

    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: res,
      },
    });
  }
}
