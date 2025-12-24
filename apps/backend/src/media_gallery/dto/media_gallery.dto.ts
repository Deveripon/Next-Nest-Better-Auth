import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

// Base MediaGallery DTO for responses
export class MediaGalleryDto {
  @ApiProperty({ description: 'Unique identifier of the media item' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Public URL of the media item' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Thumbnail URL of the media item', required: false })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ description: 'Original filename of the uploaded file' })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({ description: 'Sanitized filename stored in the system', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ description: 'Alternative text for accessibility', required: false })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({ description: 'Caption or description of the media', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'Size of the file in bytes' })
  @IsInt()
  @IsPositive()
  size: number;

  @ApiProperty({ description: 'File format/extension (e.g. jpg, png)' })
  @IsString()
  @IsNotEmpty()
  format: string;

  @ApiProperty({ description: 'Width of the media in pixels' })
  @IsInt()
  @IsPositive()
  width: number;

  @ApiProperty({ description: 'Height of the media in pixels' })
  @IsInt()
  @IsPositive()
  height: number;

  @ApiProperty({ description: 'Cloudinary Asset ID' })
  @IsString()
  @IsNotEmpty()
  cloudinaryId: string;

  @ApiProperty({ description: 'Cloudinary Public ID' })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiProperty({ description: 'Type of resource (image, video, etc.)', enum: ['image', 'video', 'raw', 'auto'] })
  @IsString()
  @IsIn(['image', 'video', 'raw', 'auto'])
  resourceType: string;

  @ApiProperty({ description: 'Tags associated with the media', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Date when the media was uploaded' })
  @IsDateString()
  uploadedAt: Date;

  @ApiProperty({ description: 'ID of the user who uploaded the media' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Record update timestamp' })
  @IsDateString()
  updatedAt: Date;
}

// DTO for creating a new media gallery item
// DTO for creating a new media gallery item
export class CreateMediaGalleryDto {
  @ApiProperty({ description: 'Public URL of the media' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({ description: 'System filename', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ description: 'Alt text', required: false })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({ description: 'Caption', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsInt()
  @IsPositive()
  size: number;

  @ApiProperty({ description: 'File format (jpg, png, etc.)' })
  @IsString()
  @IsNotEmpty()
  format: string; // jpg,png,jpeg,gif,webp

  @ApiProperty({ description: 'Width in pixels' })
  @IsInt()
  @IsPositive()
  width: number;

  @ApiProperty({ description: 'Height in pixels' })
  @IsInt()
  @IsPositive()
  height: number;

  @ApiProperty({ description: 'Cloudinary Asset ID' })
  @IsString()
  @IsNotEmpty()
  cloudinaryId: string;

  @ApiProperty({ description: 'Cloudinary Public ID' })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiProperty({ description: 'Resource type', enum: ['image', 'video', 'raw', 'auto'] })
  @IsString()
  @IsIn(['image', 'video', 'raw', 'auto'])
  resourceType: string;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];
}

// DTO for updating an existing media gallery item
// DTO for updating an existing media gallery item
export class UpdateMediaGalleryDto {
  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ description: 'System filename', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ description: 'Alt text', required: false })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({ description: 'Caption', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];
}

// DTO for media gallery queries/filtering
export class MediaGalleryQueryDto {
  @ApiProperty({ description: 'Filter by User ID', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Filter by format', required: false })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiProperty({ description: 'Filter by resource type', enum: ['image', 'video', 'raw', 'auto'], required: false })
  @IsOptional()
  @IsIn(['image', 'video', 'raw', 'auto'])
  resourceType?: string;

  @ApiProperty({ description: 'Filter by tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Minimum file size in bytes', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minSize?: number;

  @ApiProperty({ description: 'Maximum file size in bytes', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxSize?: number;

  @ApiProperty({ description: 'Minimum width in pixels', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minWidth?: number;

  @ApiProperty({ description: 'Maximum width in pixels', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxWidth?: number;

  @ApiProperty({ description: 'Minimum height in pixels', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minHeight?: number;

  @ApiProperty({ description: 'Maximum height in pixels', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxHeight?: number;

  @ApiProperty({ description: 'Filter by upload date (after)', required: false })
  @IsOptional()
  @IsDateString()
  uploadedAfter?: Date;

  @ApiProperty({ description: 'Filter by upload date (before)', required: false })
  @IsOptional()
  @IsDateString()
  uploadedBefore?: Date;

  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Items per page', default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @ApiProperty({ description: 'Sort field', enum: ['uploadedAt', 'createdAt', 'updatedAt', 'size', 'originalName'], required: false })
  @IsOptional()
  @IsIn(['uploadedAt', 'createdAt', 'updatedAt', 'size', 'originalName'])
  sortBy?: 'uploadedAt' | 'createdAt' | 'updatedAt' | 'size' | 'originalName';

  @ApiProperty({ description: 'Sort order', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

// Simplified DTO for listing media items
export class MediaGalleryListDto {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Public URL' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({ description: 'Alt text', required: false })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({ description: 'Caption', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'File size' })
  @IsInt()
  @IsPositive()
  size: number;

  @ApiProperty({ description: 'Format' })
  @IsString()
  @IsNotEmpty()
  format: string;

  @ApiProperty({ description: 'Width' })
  @IsInt()
  @IsPositive()
  width: number;

  @ApiProperty({ description: 'Height' })
  @IsInt()
  @IsPositive()
  height: number;

  @ApiProperty({ description: 'Resource type' })
  @IsString()
  @IsNotEmpty()
  resourceType: string;

  @ApiProperty({ description: 'Tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Uploaded at' })
  @IsDateString()
  uploadedAt: Date;
}

// DTO for bulk operations
export class BulkUpdateMediaGalleryDto {
  @ApiProperty({ description: 'Array of media IDs to update', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  ids: string[];

  @ApiProperty({ description: 'Updates to apply to all selected media items' })
  @ValidateNested()
  @Type(() => UpdateMediaGalleryDto)
  updates: UpdateMediaGalleryDto;
}

// DTO for media upload response
export class MediaUploadResponseDto {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Public URL' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ description: 'Public ID' })
  @IsString()
  publicId: string;

  @ApiProperty({ description: 'Cloudinary Asset ID' })
  @IsString()
  cloudinaryId: string;

  @ApiProperty({ description: 'Original filename' })
  @IsString()
  originalName: string;

  @ApiProperty({ description: 'File size' })
  @IsInt()
  @IsPositive()
  size: number;

  @ApiProperty({ description: 'Format' })
  @IsString()
  format: string;

  @ApiProperty({ description: 'Width' })
  @IsInt()
  @IsPositive()
  width: number;

  @ApiProperty({ description: 'Height' })
  @IsInt()
  @IsPositive()
  height: number;

  @ApiProperty({ description: 'Resource type' })
  @IsString()
  resourceType: string;

  @ApiProperty({ description: 'Uploaded at' })
  @IsDateString()
  uploadedAt: Date;
}
