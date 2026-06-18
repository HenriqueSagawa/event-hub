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

export const CompleteProfileSchema = z.object({
  avatarUrl: z.string().url('URL da foto inválida').optional().or(z.literal('')),
  course: z.string().min(2, 'O curso deve ter pelo menos 2 caracteres'),
  semester: z.number().int().min(1, 'Semestre inválido'),
  academicRecord: z.string().min(5, 'Registro acadêmico inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  githubUrl: z.string().url('URL do GitHub inválida').optional().or(z.literal('')),
  linkedinUrl: z.string().url('URL do LinkedIn inválida').optional().or(z.literal('')),
  interests: z.array(z.string()).optional(),
  bio: z.string().max(500, 'A bio deve ter no máximo 500 caracteres').optional(),
});
