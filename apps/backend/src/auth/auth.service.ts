import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  public auth: ReturnType<typeof betterAuth>;

  constructor(private prisma: PrismaService) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: 'postgresql',
      }),
      secret: process.env.BETTER_AUTH_SECRET,
    });
  }
}
