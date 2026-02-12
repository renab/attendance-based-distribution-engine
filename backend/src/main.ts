import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as zlib from 'zlib';
import { IncomingMessage } from 'http';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('App');
  // Disable Nest's built-in body parser so we can handle gzip decoding first
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  // Gzip decompression middleware for incoming requests
  const gzipDecompressMiddleware = (req: IncomingMessage & { body?: any }, res, next) => {
    try {
      const encoding = (req.headers['content-encoding'] || '').toString().toLowerCase();
      if (encoding !== 'gzip') return next();
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const decompressed = zlib.gunzipSync(buffer);
          // If JSON, parse and attach to req.body so controllers receive parsed body
          const contentType = (req.headers['content-type'] || '').toString().toLowerCase();
          if (contentType.includes('application/json')) {
            try {
              (req as any).body = JSON.parse(decompressed.toString('utf8'));
            } catch (e) {
              return next(e);
            }
          } else {
            (req as any).body = decompressed;
          }
          // Remove content-encoding so downstream logic does not attempt to re-decode
          delete req.headers['content-encoding'];
          // Update content-length header to the decompressed size
          req.headers['content-length'] = String((req as any).body ? Buffer.byteLength(typeof (req as any).body === 'string' ? (req as any).body : JSON.stringify((req as any).body)) : 0);
          return next();
        } catch (err) {
          return next(err);
        }
      });
      req.on('error', (err) => next(err));
    } catch (err) {
      return next(err);
    }
  };

  app.use(gzipDecompressMiddleware);
  // Re-enable JSON/urlencoded body parsing for non-gzipped requests (and to ensure req.body exists)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.enableCors();
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'main' });
  await app.listen(process.env.APP_PORT);
  logger.log(`Application started on port ${process.env.APP_PORT}`);
}
bootstrap();
