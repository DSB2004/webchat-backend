import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
      statusCode: 429,
      message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.rateLimiter(req, res, next); // ONLY this
  }
}
