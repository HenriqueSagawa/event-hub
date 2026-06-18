import { prismaMock } from './__mocks__/prisma';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

jest.mock('../src/services/mail.service', () => ({
  mailService: {
    sendVerificationCode: jest.fn(),
  },
}));

// Set a consistent JWT secret for tests
process.env.JWT_SECRET = 'test_jwt_secret';

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn((token, secret) => {
    if (secret === 'test_jwt_secret') {
      return { sub: 'mockUserId', email: 'integration@example.com' };
    }
    throw new Error('Invalid secret for JWT verification');
  }),
}));
