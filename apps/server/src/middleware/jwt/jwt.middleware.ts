import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VerifyJWT } from '@webchat-backend/jwt'; // your shared JWT utility

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (req.originalUrl.includes('auth')) return next();
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const payload = await VerifyJWT(authHeader);
      if (!payload || payload === null)
        return res
          .status(401)
          .json({ message: 'Unauthorized: Invalid or expired token' });
      req.headers['request_email'] = payload.email;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
