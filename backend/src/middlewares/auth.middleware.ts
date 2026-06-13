import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../errors/api-error';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    throw new UnauthorizedError('Token mal formatado');
  }

  const [scheme, token] = parts;

  if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
    throw new UnauthorizedError('Token mal formatado');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    req.userId = decoded.sub;
    return next();
  } catch (err) {
    throw new UnauthorizedError('Token inválido');
  }
};
