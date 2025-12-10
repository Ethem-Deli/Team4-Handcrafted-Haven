import PrismaPkg from "@prisma/client";

const { PrismaClient } = PrismaPkg;
type PrismaClientType = typeof PrismaClient;

const globalForPrisma = global as unknown as { prisma: InstanceType<PrismaClientType> };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
