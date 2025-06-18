import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VerifyJWT } from '@webchat-backend/jwt'; // your shared JWT utility

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = VerifyJWT(token);
      if (!payload || payload === null)
        return res
          .status(401)
          .json({ message: 'Unauthorized: Invalid or expired token' });
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
