// auth.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
