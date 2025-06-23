import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { db } from '@webchat-backend/db';
@Injectable()
export class IsVerifedMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    try {
      if (req.originalUrl.includes('auth')) return next();
      const email = req.headers['request_email'];
      const isVerified =
        (await db.auth.findUnique({
          where: {
            email,
            isVerified: true,
          },
        })) !== null;
      if (!isVerified)
        return res.status(403).json({ message: 'User not verified' });
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
    }
  }
}
