import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OtpService } from './otp.service';

@Module({
  imports: [PrismaModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
