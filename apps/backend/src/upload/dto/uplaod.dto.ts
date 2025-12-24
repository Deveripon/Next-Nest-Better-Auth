import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ImageFolder {
  DRAFTS = 'drafts',
  PACKAGES = 'packages',
  PROFILES = 'profiles',
  DESTINATION = 'destination',
  TEMP = 'temp',
  TRANSPORTATIONS = 'transportations',
  HOTELS = 'hotels',
  ACTIVITIES = 'activities',
  RESTAURANTS = 'restaurants',
  MEALS = 'meals',
  'branding/logos' = 'branding/logos',
  'users/media' = 'users/media',
}

export class UploadImageDto {
  @ApiProperty({ description: 'Target folder', enum: ImageFolder, default: ImageFolder.DRAFTS, required: false })
  @IsOptional()
  @IsEnum(ImageFolder)
  folder?: ImageFolder = ImageFolder.DRAFTS;

  @ApiProperty({ description: 'User ID', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags?: string[];

  @ApiProperty({ description: 'Public ID (optional override)', required: false })
  @IsOptional()
  @IsString()
  publicId?: string;
}

export class MoveImageDto {
  @ApiProperty({ description: 'Public ID of image to move' })
  @IsString()
  publicId: string;

  @ApiProperty({ description: 'New folder', enum: ImageFolder })
  @IsEnum(ImageFolder)
  newFolder: ImageFolder;

  @ApiProperty({ description: 'User ID', required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class DeleteImagesDto {
  @ApiProperty({ description: 'Array of Public IDs to delete', type: [String] })
  @IsArray()
  @IsString({ each: true })
  publicIds: string[];
}

export class UploadResponseDto {
  @ApiProperty({ description: 'Success flag' })
  success: boolean;

  @ApiProperty({ description: 'Message', required: false })
  message?: string;

  @ApiProperty({ description: 'Image URL' })
  url?: string;

  @ApiProperty({ description: 'Public ID' })
  publicId?: string;
  
  @ApiProperty({ description: 'Data object', required: false })
  data?: any;
}

export class DeleteImageResponseDto {
  @ApiProperty({ description: 'Success flag' })
  success: boolean;

  @ApiProperty({ description: 'Message' })
  message?: string;
  
  @ApiProperty({ description: 'Deleted items info', required: false })
  deleted?: any;
}
