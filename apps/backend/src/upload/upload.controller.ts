/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
  Post,
  Query,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { memoryStorage } from 'multer';
import {
  CloudinaryService,
  CloudinaryUploadResult,
} from 'src/cloudinary/cloudinary.service';
import { MediaGalleryService } from 'src/media_gallery/media_gallery.service';
import {
  DeleteImageResponseDto,
  DeleteImagesDto,
  ImageFolder,
  MoveImageDto,
  UploadImageDto,
  UploadResponseDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDoc } from '../decorators/swagger.decorator';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  private readonly maxSize = 10 * 1024 * 1024; // 10MB

  transform(file: Express.Multer.File | Express.Multer.File[]) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const files = Array.isArray(file) ? file : [file];

    for (const f of files) {
      // Check file size
      if (f.size > this.maxSize) {
        throw new BadRequestException(
          `File ${f.originalname} is too large. Max size is 10MB`,
        );
      }

      // Check mime type
      if (!this.allowedMimeTypes.includes(f.mimetype)) {
        throw new BadRequestException(
          `File ${f.originalname} has invalid type. Only images are allowed`,
        );
      }
    }

    return file;
  }
}

@ApiTags('Upload')
@Controller({
  path: 'upload',
  version: '1',
})
@UseGuards(ThrottlerGuard) // for upload rate limitting
export class UploadController {
  constructor(
    private cloudinaryService: CloudinaryService,
    private mediaGalleryService: MediaGalleryService,
  ) {}

  // Upload Profile Photo
  @ApiDoc({
    summary: 'Upload profile photo',
    description: 'Uploads a profile photo for the authenticated user.',
    response: UploadResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('profile-photo')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed'), false);
        }
      },
    }),
  )
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const uploadedImageLink: CloudinaryUploadResult | null =
        await this.cloudinaryService.uploadFileToCloudinary(file);
      return {
        message: 'Image uploaded successfully',
        url: uploadedImageLink?.secure_url ?? '',
        publicId: uploadedImageLink?.public_id ?? '',
      };
    } catch (error) {
      throw new InternalServerErrorException(error || 'Image upload failed');
    }
  }

  // Remove Profile Photo
  @ApiDoc({
    summary: 'Delete profile photo',
    description: 'Removes the profile photo.',
    response: DeleteImageResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('delete-profile-photo')
  @HttpCode(HttpStatus.OK)
  async deleteProfilePhoto(@Body('public_id') public_id: string) {
    try {
      const result =
        await this.cloudinaryService.deleteFileFromCloudinary(public_id);

      if (result.result === 'not found') {
        throw new BadRequestException(
          'Image with this public_id was not found',
        );
      }

      return {
        message: 'Image deleted successfully',
        result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error || 'Image deletion failed');
    }
  }

  @ApiDoc({
    summary: 'Upload single image',
    description: 'Uploads a single image to a specific folder.',
    response: UploadResponseDto,
    status: HttpStatus.OK,
  })
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadSingleImage(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
    @Body() uploadDto: UploadImageDto,
  ) {
    try {
      const result = await this.cloudinaryService.uploadImage(file, {
        folder: uploadDto.folder || ImageFolder.DRAFTS,
        userId: uploadDto.userId || 'anonymous',
        tags: uploadDto.tags || [],
        public_id: uploadDto.publicId,
      });

      return {
        success: true,
        data: {
          id: result.public_id,
          url: result.secure_url,
          thumbnail: (result.secure_url ?? '').replace(
            '/upload/',
            '/upload/w_200,h_200,c_fill/',
          ),
          originalName: file.originalname,
          size: result.bytes,
          format: result.format,
          width: result.width,
          height: result.height,
          cloudinaryData: result,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @ApiDoc({
    summary: 'Upload multiple images',
    description: 'Uploads multiple images to a specific folder.',
    response: UploadResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('image/multiple')
  @UseInterceptors(FilesInterceptor('gallery', 50)) // Max 50 files
  @HttpCode(HttpStatus.OK)
  async uploadMultipleImages(
    @UploadedFiles(new ImageValidationPipe()) files: Express.Multer.File[],
    @Body() uploadDto: UploadImageDto,
    @Request() req: any,
  ) {
    try {
      const results = await this.cloudinaryService.uploadMultipleImages(files, {
        folder: uploadDto.folder || ImageFolder.DRAFTS,
        userId: uploadDto.userId || 'anonymous',
        tags: uploadDto.tags || [],
      });

      const formattedResults = results.map((result, index) => ({
        id: result.public_id,
        url: result.secure_url,
        thumbnail: (result.secure_url ?? '').replace(
          '/upload/',
          '/upload/w_200,h_200,c_fill/',
        ),
        originalName: files[index].originalname,
        size: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        cloudinaryData: result,
      }));

      const uploadedMediaData = await Promise.all(
        formattedResults.map((result) =>
          this.mediaGalleryService.uploadMedia(
            {
              url: result.url ?? '',
              thumbnail: result.thumbnail,
              originalName: result.originalName,
              size: result.size ?? 0,
              format: result.format ?? '',
              width: result.width ?? 0,
              height: result.height ?? 0,
              cloudinaryId: result.id ?? '',
              publicId: result.id ?? '',
              resourceType: result.cloudinaryData.resource_type ?? '',
              tags: result.cloudinaryData.tags ?? [],
            },
            req.user.id,
          ),
        ),
      );

      return {
        success: true,
        data: formattedResults,
        uploadedMediaData,
        uploadedCount: formattedResults.length,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @ApiDoc({
    summary: 'Move image',
    description: 'Moves an image to a different folder.',
    response: UploadResponseDto,
    status: HttpStatus.OK,
  })
  @Post('image/move')
  @HttpCode(HttpStatus.OK)
  async moveImage(@Body() moveDto: MoveImageDto) {
    try {
      const result = await this.cloudinaryService.moveImageToFolder(
        moveDto.publicId,
        moveDto.newFolder,
        moveDto.userId,
      );

      return {
        success: true,
        data: {
          id: result.public_id,
          url: result.secure_url,
          thumbnail: (result.secure_url ?? '').replace(
            '/upload/',
            '/upload/w_200,h_200,c_fill/',
          ),
          size: result.bytes,
          format: result.format,
          cloudinaryData: result,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Move failed: ${error.message}`);
    }
  }

  @ApiDoc({
    summary: 'Delete multiple images',
    description: 'Deletes multiple images by their public IDs.',
    response: DeleteImageResponseDto,
    status: HttpStatus.OK,
  })
  @Delete('image/delete/multiple')
  @HttpCode(HttpStatus.OK)
  async deleteImages(@Body() deleteDto: DeleteImagesDto) {
    try {
      const result = await this.cloudinaryService.deleteMultipleImages(
        deleteDto.publicIds,
      );

      return {
        success: true,
        deleted: result.deleted,
        deletedCount: Object.keys(result.deleted).length,
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  @ApiDoc({
    summary: 'Delete single image',
    description: 'Deletes a single image by its public ID.',
    response: DeleteImageResponseDto,
    status: HttpStatus.OK,
  })
  @Delete('image/delete')
  @HttpCode(HttpStatus.OK)
  async deleteSingleImageByBody(@Body() body: { publicId: string }) {
    try {
      const { publicId } = body;

      if (!publicId) {
        throw new BadRequestException('publicId is required');
      }

      console.log('Attempting to delete image with public_id:', publicId);

      const result = await this.cloudinaryService.deleteImage(publicId);

      if (result.result === 'ok') {
        return {
          success: true,
          message: 'Image deleted successfully',
          result: result.result,
        };
      } else if (result.result === 'not found') {
        return {
          success: false,
          message: 'Image not found',
          result: result.result,
        };
      } else {
        throw new BadRequestException(
          `Delete failed with result: ${result.result}`,
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  @ApiDoc({
    summary: 'List images',
    description: 'Lists images from a specific folder.',
    response: UploadResponseDto,
    status: HttpStatus.OK,
  })
  @Get('images/list')
  @HttpCode(HttpStatus.OK)
  async getImages(
    @Query('folder') folder: ImageFolder = ImageFolder.DRAFTS,
    @Query('userId') userId?: string,
    @Query('limit') limit: number = 50,
  ) {
    try {
      const images = await this.cloudinaryService.getImagesByFolder(
        folder,
        userId,
        Math.min(limit, 100), // Max 100 images per request
      );

      const formattedImages = images.map((image) => ({
        id: image.public_id,
        url: image.secure_url,
        thumbnail: (image.secure_url ?? '').replace(
          '/upload/',
          '/upload/w_200,h_200,c_fill/',
        ),
        size: image.bytes,
        format: image.format,
        width: image.width,
        height: image.height,
        createdAt: image.created_at,
        tags: image.tags,
        cloudinaryData: image,
      }));

      return {
        success: true,
        data: formattedImages,
        count: formattedImages.length,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get images: ${error.message}`);
    }
  }

  @ApiDoc({
    summary: 'Cleanup old drafts',
    description: 'Deletes draft images older than specified hours.',
    response: DeleteImageResponseDto,
    status: HttpStatus.OK,
  })
  @Post('cleanup-old-drafts')
  @HttpCode(HttpStatus.OK)
  async cleanupOldDrafts(@Body('hours') hours: number = 24) {
    try {
      const result = await this.cloudinaryService.cleanupOldDrafts(hours);

      return {
        success: true,
        deletedCount: result.deletedCount,
        message: `Cleaned up ${result.deletedCount} old draft images`,
      };
    } catch (error) {
      throw new BadRequestException(`Cleanup failed: ${error.message}`);
    }
  }
}
