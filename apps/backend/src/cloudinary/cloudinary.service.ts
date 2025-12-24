/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as toStream from 'buffer-to-stream';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
  secure_url?: string;
  public_id?: string;
  url?: string;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
  resource_type?: string;
  created_at?: string;
  tags?: string[];
  folder?: string;
  [key: string]: any; // fallback
}

@Injectable()
export class CloudinaryService {
  private readonly MAX_SIZE_WITHOUT_TRANSFORMATION = 3 * 1024 * 1024; // 3MB in bytes

  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDE_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  private shouldApplyTransformation(fileSize: number): boolean {
    return fileSize > this.MAX_SIZE_WITHOUT_TRANSFORMATION;
  }

  private getTransformationOptions(fileSize: number): any[] | undefined {
    if (!this.shouldApplyTransformation(fileSize)) {
      return undefined;
    }

    return [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
      { width: 1200, height: 1200, crop: 'limit' },
    ];
  }

  async uploadFileToCloudinary(
    file: Express.Multer.File,
  ): Promise<CloudinaryUploadResult | null> {
    if (!file) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const transformation = this.getTransformationOptions(file.size);

      const uploadOptions: any = {
        folder: 'user-profile',
      };

      if (transformation) {
        uploadOptions.transformation = transformation;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            // Handle the error properly by checking its type
            if (error instanceof Error) {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              return reject(error); // Now we are sure that 'error' is an instance of Error
            }
            // If error is not an instance of Error, reject with a generic message
            return reject(new Error('Unknown upload error'));
          }

          // Explicit check if result is undefined (though it shouldn't be)
          if (!result) {
            return reject(
              new Error('Cloudinary upload failed: No result returned.'),
            );
          }

          resolve(result);
        },
      );
      // Ensure the buffer is of type Buffer before passing it to toStream
      if (!Buffer.isBuffer(file.buffer)) {
        return reject(new Error('Uploaded file is not a valid buffer.'));
      }

      toStream(file?.buffer).pipe(uploadStream);
    });
  }

  async deleteFileFromCloudinary(
    publicId: string,
  ): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image', // optional, but useful if you're deleting other types too
      });
      return result; // returns { result: 'ok' } or { result: 'not found' }
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      throw new InternalServerErrorException(
        'Failed to delete image from Cloudinary',
      );
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    options: {
      folder?: string;
      userId?: string;
      tags?: string[];
      transformation?: any[];
      public_id?: string;
      forceTransformation?: boolean; // New option to force transformation regardless of size
    } = {},
  ): Promise<CloudinaryUploadResult> {
    const {
      folder = 'drafts',
      userId = 'anonymous',
      tags = [],
      transformation,
      public_id,
      forceTransformation = false,
    } = options;

    try {
      // Create a readable stream from buffer
      const stream = Readable.from(file.buffer);

      // Determine transformation based on file size or forced transformation
      let finalTransformation: any[] | undefined;

      if (forceTransformation && transformation) {
        // Use provided transformation if forced
        finalTransformation = transformation;
      } else if (!forceTransformation) {
        // Use conditional transformation based on file size
        finalTransformation = this.getTransformationOptions(file.size);
      }
      // If forceTransformation is true but no transformation provided, no transformation will be applied

      const uploadOptions: any = {
        folder: `${folder}/${userId}`,
        tags: [...tags, 'draft', `user_${userId}`, folder],
        public_id:
          public_id ||
          `${folder}_${userId}_${Date.now()}_${file.originalname.split('.')[0]}`,
        resource_type: 'auto',
      };

      if (finalTransformation) {
        uploadOptions.transformation = finalTransformation;
      }

      const uploadResult = await new Promise<
        UploadApiResponse | UploadApiErrorResponse
      >((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(
                new Error(
                  `Cloudinary upload failed: ${error?.message || JSON.stringify(error)}`,
                ),
              );
            } else if (!result) {
              reject(
                new Error('Cloudinary upload failed: No result returned.'),
              );
            } else {
              resolve(result);
            }
          },
        );
        stream.pipe(uploadStream);
      });

      if ('error' in uploadResult) {
        throw new BadRequestException(
          `Upload failed: ${uploadResult.error.message}`,
        );
      }

      return {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        url: uploadResult.url,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        resource_type: uploadResult.resource_type,
        created_at: uploadResult.created_at,
        tags: uploadResult.tags,
        folder: uploadResult.folder,
      };
    } catch (error) {
      throw new BadRequestException(`Image upload failed: ${error.message}`);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    options: {
      folder?: string;
      userId?: string;
      tags?: string[];
      forceTransformation?: boolean;
    } = {},
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, options));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }

  async deleteMultipleImages(
    publicIds: string[],
  ): Promise<{ deleted: Record<string, string> }> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete images: ${error.message}`,
      );
    }
  }

  async moveImageToFolder(
    publicId: string,
    newFolder: string,
    userId?: string,
  ): Promise<CloudinaryUploadResult> {
    try {
      const newPublicId = `${newFolder}/${userId || 'anonymous'}/${publicId.split('/').pop()}`;

      const result = await cloudinary.uploader.rename(publicId, newPublicId);

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        bytes: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        resource_type: result.resource_type,
        created_at: result.created_at,
        tags: result.tags,
        folder: newFolder,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to move image: ${error.message}`);
    }
  }

  async getImagesByFolder(
    folder: string,
    userId?: string,
    maxResults: number = 50,
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const prefix = userId ? `${folder}/${userId}` : folder;
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix,
        max_results: maxResults,
      });

      return result.resources.map((resource) => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        url: resource.url,
        bytes: resource.bytes,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        resource_type: resource.resource_type,
        created_at: resource.created_at,
        tags: resource.tags || [],
        folder: resource.folder,
      }));
    } catch (error) {
      throw new BadRequestException(`Failed to get images: ${error.message}`);
    }
  }

  async cleanupOldDrafts(
    olderThanHours: number = 24,
  ): Promise<{ deletedCount: number }> {
    try {
      const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
      const timestamp = Math.floor(cutoffTime.getTime() / 1000);

      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'drafts/',
        max_results: 500,
        created_at: { lte: timestamp },
      });

      if (resources.length === 0) {
        return { deletedCount: 0 };
      }

      const publicIds: string[] = resources.map(
        (resource: { public_id: string }) => resource.public_id,
      );
      const result = (await cloudinary.api.delete_resources(publicIds)) as {
        deleted: Record<string, string>;
      };

      return { deletedCount: Object.keys(result.deleted).length };
    } catch (error) {
      console.error('Cleanup error:', error);
      return { deletedCount: 0 };
    }
  }
}
