import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ApiKeyCheckMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: any, res: any, next: () => void) {
    const incomingKey =
      req.headers['internal_api_key'] || req.headers['INTERNAL_API_KEY'];

    const expectedKey = this.configService.get<string>('INTERNAL_API_KEY');

    if (!incomingKey || incomingKey !== expectedKey) {
      throw new HttpException('Invalid or missing internal API key', 403);
    }

    next();
  }
}
