import { PrismaClient } from "../../src/generated/prisma";
import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";

import { prisma as actualPrisma } from "../../src/config/prisma";

jest.mock("../../src/config/prisma", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

export const prismaMock =
  actualPrisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
