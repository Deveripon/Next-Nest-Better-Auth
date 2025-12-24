import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ImageObject {
  [key: string]: any;

  @ApiProperty()
  url: string;

  @ApiProperty()
  public_id: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  /*   @ApiProperty({ description: 'Profile image object', type: ImageObject, required: false })
  @IsOptional()
  @IsValidImageObject({
    message: 'Image must contain both url and public_id',
  })
  image?: ImageObject; */

  @ApiProperty({ description: 'Date of birth', required: false })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty({ description: 'Nationality', required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: 'Gender', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'Location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Website URL', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ description: 'Password', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'Refresh token', required: false })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiProperty({ description: 'Email verification status', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class UpdateForgottedPasswordDto {
  @ApiProperty({ description: 'New password' })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  old_password: string;

  @ApiProperty({ description: 'New password', minLength: 8 })
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
  new_password: string;
}

export class CreateUserDto {
  @ApiProperty({ description: 'Full name', default: '', required: false })
  @IsString()
  @IsOptional()
  name: string = '';

  @ApiProperty({ description: 'Email address' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password', minLength: 8 })
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
      'Role must be one of: , ADMIN, EDITOR TOUR_OPERATOR, USER, GUIDE, STAFF',
  })
  @IsOptional()
  role: UserRole = UserRole.USER;
}

export class UpdaateRoleDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole, {
    message:
      'Role must be one of: , ADMIN, EDITOR TOUR_OPERATOR, USER, GUIDE, STAFF',
  })
  @IsOptional()
  role: UserRole = UserRole.USER;
}

export class UpdateUserByAdminDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus, {
    message: `Status must be one of: ${Object.values(UserStatus).join(', ')}`,
  })
  status?: UserStatus;
}

// --- Response DTOs ---

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ type: ImageObject, required: false })
  image?: ImageObject;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ required: false })
  dob?: string;

  @ApiProperty({ required: false })
  nationality?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  website?: string;

  @ApiProperty({ required: false })
  company?: string;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  isVerified?: boolean;

  @ApiProperty({ enum: UserStatus, required: false })
  status?: UserStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetAllUsersResponse {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];
}

export class GenericMessageResponseDto {
  @ApiProperty()
  message: string;
}

export class UserMessageResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserResponseDto })
  user?: UserResponseDto; // Made optional as sometimes it might be named updatedUser or similar
}

export class UpdateForgotPasswordResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserResponseDto })
  updatedUser: UserResponseDto;
}
