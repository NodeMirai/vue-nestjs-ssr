import * as fs from 'fs';
import * as path from 'path';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import * as serverBundle from './ssr/server-bundle.json';
import * as clientManifest from './ssr/client-manifest.json';
import { createBundleRenderer } from 'vue-server-renderer';

// const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'preonline';
const templatePath = path.join(__dirname, './index.template.html');
const template = fs.readFileSync(templatePath, 'utf-8');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Req() request: Request, @Res() response: Response) {
    const render = createBundleRenderer(serverBundle, {
      clientManifest,
      template,
      inject: false,
      runInNewContext: false,
      shouldPreload: () => false,
      shouldPrefetch: () => false,
    });

    const html = await render.renderToString({});

    response.status(200).send(html);
  }
}
