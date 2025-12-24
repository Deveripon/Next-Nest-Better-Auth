import { ApiProperty } from '@nestjs/swagger';

// class for token response
export class TokenResponse {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT Refresh Token' })
  refreshToken: string;
}

// class for user authentication response
export class AuthResponse {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User Name', nullable: true })
  name: string | null;

  @ApiProperty({ description: 'User Email' })
  email: string;

  @ApiProperty({ description: 'User Role', required: false })
  role: string | undefined;

  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT Refresh Token' })
  refreshToken: string;
}

// class for sign up response
export class SignUpResponse {
  @ApiProperty({ description: 'Success Message' })
  message: string;
}

// class for OTP response
export class OtpResponse {
  @ApiProperty({ description: 'Success Message' })
  message: string;
}

// class for OTP verification response
export class VerifyOtpResponse {
  @ApiProperty({ description: 'Verification Status' })
  isVerified: boolean;

  @ApiProperty({ description: 'Success Message' })
  message: string;
}
