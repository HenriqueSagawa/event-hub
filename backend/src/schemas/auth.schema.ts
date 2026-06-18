import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string(),
});

export const VerifySchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().length(6, 'O código deve ter 6 dígitos'),
});
