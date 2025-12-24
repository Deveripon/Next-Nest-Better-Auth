import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SendOtpDto } from 'src/auth/dto/send-otp.dto';
import { VerifyOtpDto } from 'src/auth/dto/verify-otp.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  // Create Otp
  async createOtp(dto: SendOtpDto): Promise<string> {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

      const res = await this.prisma.otp.create({
        data: { email: dto.email, code: otp, expiresAt },
      });

      console.log(`otp creation response`, res);

      return otp;
    } catch (error) {
      console.error('OTP creation failed:', error);
      throw new InternalServerErrorException('Could not create OTP');
    }
  }

  // Resend OTP
  async resendOtp(dto: SendOtpDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Delete previous OTP
      await this.prisma.otp.deleteMany({
        where: { email: dto.email },
      });

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
      // Save new OTP
      await this.prisma.otp.create({
        data: { email: dto.email, code: otp, expiresAt },
      });
      return otp;
    } catch (error) {
      console.error('OTP creation failed:', error);
      throw new InternalServerErrorException('Could not create OTP');
    }
  }

  // Verify OTP
  async verifyOtp(dto: VerifyOtpDto): Promise<boolean> {
    try {
      const otpEntry = await this.prisma.otp.findFirst({
        where: {
          email: dto.email,
          code: dto.otp,
          expiresAt: { gte: new Date() },
        },
      });

      if (!otpEntry?.id) {
        return false;
      }

      await this.prisma.otp.delete({
        where: { id: otpEntry.id },
      });

      return true;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw new InternalServerErrorException('Could not verify OTP');
    }
  }
}
