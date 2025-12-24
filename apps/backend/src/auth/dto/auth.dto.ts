import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class signUpDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  name: string = '';

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  phone: string = '';

  @ApiProperty({
    description: 'URL to user profile image',
    example: 'https://example.com/avatar.jpg',
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  image: string = '';

  @ApiProperty({
    description: 'Strong password containing uppercase, lowercase, number. Min 8 chars.',
    example: 'Password123',
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0, // symbols now optional
    },
    {
      message:
        'Password must contain at least One Uppercase,One lowercase,One Number with at least 8 characters',
    },
  )
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole, {
    message:
      'Role must be one of: ADMIN, EDITOR TOUR_OPERATOR, USER, GUIDE, STAFF',
  })
  @IsOptional()
  role: UserRole = UserRole.USER;
}

export class signInDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class refreshTokenDto {
  @ApiProperty({
    description: 'Refresh token string',
    required: false,
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiProperty({
    description: 'Auth provider (e.g. google, github)',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;
}
