import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { MediaGalleryController } from './media_gallery/media_gallery.controller';
import { MediaGalleryModule } from './media_gallery/media_gallery.module';
import { MediaGalleryService } from './media_gallery/media_gallery.service';
import { OtpModule } from './otp/otp.module';
import { OtpService } from './otp/otp.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';
import { AdminUsersController } from './user/admin/admin.controller';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 50, // 20 uploads per minute
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,

    AuthModule,
    UserModule,
    OtpModule,
    MailModule,
    CloudinaryModule,
    UploadModule,

    RolesModule,

    MediaGalleryModule,
  ],
  providers: [
    PrismaService,
    ConfigService,
    UserService,
    OtpService,
    MailService,
    UploadService,
    AuthService,
    RolesService,

    MediaGalleryService,
  ],
  controllers: [
    UserController,
    UploadController,

    AdminUsersController,

    MediaGalleryController,
  ],
})
export class AppModule {}
