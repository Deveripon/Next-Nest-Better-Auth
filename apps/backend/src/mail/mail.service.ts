import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OtpTemplate } from './templates/otp-template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASS'), // App Password
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: `"TripWheel" <${this.config.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'Verify Your Email at TripWheel',
      html: OtpTemplate(otp),
    });
  }

  async sentEmail(mailContent: any): Promise<void> {
    await this.transporter.sendMail({
      from: `"TripWheel" <${this.config.get<string>('EMAIL_USER')}>`,
      ...mailContent,
    });
  }
}

// For SMTP configuaration for use webmail
/* import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('EMAIL_HOST'), // e.g., mail.pixelvega.com
      port: this.config.get<number>('EMAIL_PORT') || 465,
      secure: true, // true for port 465, false for 587
      auth: {
        user: this.config.get<string>('EMAIL_USER'), // ripon@pixelvega.com
        pass: this.config.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: `"Pixel Vega" <${this.config.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    });
  }
}
 */
