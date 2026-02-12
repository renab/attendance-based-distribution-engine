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
      // If the request stream is already not readable, skip decompression
      if ((req as any).readable === false || (req as any).readableEnded) return next();

      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer | string) => {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      });

      req.on('end', () => {
        if (chunks.length === 0) return next();
        const buffer = Buffer.concat(chunks);

        // Use async gunzip to avoid blocking the event loop
        zlib.gunzip(buffer, (err, decompressed) => {
          if (err) {
            return next(new Error(`Gzip decompression failed: ${err.message}`));
          }
          try {
            // Parse as JSON regardless of content-type, because the client
            // sends gzipped JSON with content-type: application/octet-stream
            // to prevent axios from re-serializing the binary payload.
            const text = decompressed.toString('utf8');
            try {
              (req as any).body = JSON.parse(text);
            } catch {
              // Not valid JSON — keep as raw buffer
              (req as any).body = decompressed;
            }

            // Tell body-parser / express.json() the body is already parsed
            (req as any)._body = true;
            // Remove content-encoding so downstream logic does not re-decode
            delete req.headers['content-encoding'];
            // Set content-type to JSON so NestJS pipes/interceptors work correctly
            req.headers['content-type'] = 'application/json';
            req.headers['content-length'] = String(
              typeof (req as any).body === 'object'
                ? Buffer.byteLength(JSON.stringify((req as any).body))
                : Buffer.byteLength(decompressed)
            );
            return next();
          } catch (parseErr) {
            return next(parseErr);
          }
        });
      });

      req.on('error', (err) => next(err));
    } catch (err) {
      return next(err);
    }
  };

  app.use(gzipDecompressMiddleware);
  // Re-enable JSON/urlencoded body parsing for non-gzipped requests (and to ensure req.body exists)
  app.use(express.json({limit: '100mb'}));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  app.enableCors();
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'main' });
  await app.listen(process.env.APP_PORT);
  logger.log(`Application started on port ${process.env.APP_PORT}`);
}
bootstrap();
