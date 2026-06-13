// tests/setup.ts
import './__mocks__/prisma';

jest.mock('../src/services/mail.service', () => ({
  mailService: {
    sendVerificationCode: jest.fn().mockResolvedValue(undefined),
  },
}));

process.env.JWT_SECRET = 'test-secret';
process.env.SMTP_HOST = 'test-host';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test-user';
process.env.SMTP_PASS = 'test-pass';
process.env.SMTP_FROM = 'test-from';
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test-db';
