import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }

  async verify(req: Request, res: Response) {
    const result = await authService.verifyEmail(req.body);
    res.status(200).json(result);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  }

  async getMe(req: Request, res: Response) {
    const userId = req.userId!;
    const user = await authService.getMe(userId);
    res.status(200).json(user);
  }
}

export const authController = new AuthController();
