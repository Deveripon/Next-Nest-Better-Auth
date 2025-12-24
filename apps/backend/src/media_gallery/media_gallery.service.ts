import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BulkUpdateMediaGalleryDto,
  CreateMediaGalleryDto,
  MediaGalleryQueryDto,
  UpdateMediaGalleryDto,
} from './dto/media_gallery.dto';

@Injectable()
export class MediaGalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Uploads/Creates a new media item in the gallery
   * @param dto - Data transfer object containing media details
   * @returns Promise resolving to the created MediaGallery object
   * @throws ConflictException if a media item with the same publicId already exists
   * @throws BadRequestException if media creation fails for any other reason
   */
  async uploadMedia(dto: CreateMediaGalleryDto, userId: string) {
    try {
      const existingMedia = await this.prisma.mediaGallery.findUnique({
        where: {
          publicId: dto.publicId,
        },
      });

      if (existingMedia) {
        throw new ConflictException('Media with this publicId already exists');
      }

      const media = await this.prisma.mediaGallery.create({
        data: {
          ...dto,
          userId,
        },
      });

      return {
        id: media.id,
        url: media.url,
        thumbnail: media.thumbnail || '',
        publicId: media.publicId,
        cloudinaryId: media.cloudinaryId,
        originalName: media.originalName,
        size: media.size,
        format: media.format,
        width: media.width,
        height: media.height,
        resourceType: media.resourceType,
        uploadedAt: media.uploadedAt,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload media');
    }
  }

  /**
   * Retrieves all media items with filtering, sorting and pagination
   * @param dto - Data transfer object containing filter criteria, sorting options and pagination parameters
   * @param userId - ID of the user requesting the media (for authorization)
   * @returns Promise resolving to object containing filtered media items, total count and pagination info
   */
  async getAllMedia(dto: MediaGalleryQueryDto, userId?: string) {
    const {
      sortBy = 'uploadedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      ...filters
    } = dto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = this.buildWhereClause(filters, userId);

    // Build orderBy
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const [mediaItems, total] = await Promise.all([
      this.prisma.mediaGallery.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.mediaGallery.count({ where }),
    ]);

    // Transform to list DTO
    const mediaList = mediaItems.map((media) => ({
      id: media.id,
      url: media.url,
      thumbnail: media.thumbnail,
      originalName: media.originalName,
      fileName: media.fileName,
      altText: media.altText,
      caption: media.caption,
      size: media.size,
      format: media.format,
      publicId: media.publicId,
      cloudinaryId: media.cloudinaryId,
      width: media.width,
      height: media.height,
      resourceType: media.resourceType,
      tags: media.tags,
      uploadedAt: media.uploadedAt,
    }));

    return {
      media: mediaList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Retrieves all media items uploaded by a specific user with filtering, sorting, and pagination.
   * @param dto - Data transfer object containing filter criteria, sorting options, and pagination parameters.
   * @param userId - ID of the user whose media items are to be retrieved.
   * @returns Promise resolving to an object containing the user's media items,
   *          total count, and pagination info.
   */

  async getAllMediaOfUser(dto: MediaGalleryQueryDto, userId?: string) {
    const {
      sortBy = 'uploadedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      ...filters
    } = dto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = this.buildWhereClause(filters, userId);

    // Build orderBy
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const [mediaItems, total] = await Promise.all([
      this.prisma.mediaGallery.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.mediaGallery.count({ where }),
    ]);

    // Transform to list DTO
    const mediaList = mediaItems.map((media) => ({
      id: media.id,
      url: media.url,
      thumbnail: media.thumbnail,
      originalName: media.originalName,
      fileName: media.fileName,
      altText: media.altText,
      caption: media.caption,
      size: media.size,
      format: media.format,
      publicId: media.publicId,
      cloudinaryId: media.cloudinaryId,
      width: media.width,
      height: media.height,
      resourceType: media.resourceType,
      tags: media.tags,
      uploadedAt: media.uploadedAt,
    }));

    return {
      media: mediaList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  /**
   * Retrieves a single media item by its ID
   * @param id - The ID of the media item
   * @param userId - ID of the user requesting the media (for authorization)
   * @returns Promise resolving to the MediaGallery object
   * @throws NotFoundException if the media item does not exist
   * @throws ForbiddenException if user doesn't have access to the media
   */
  async getSingleMedia(id: string, userId: string) {
    const media = await this.prisma.mediaGallery.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    // Verify user authorization
    if (media.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this media',
      );
    }

    return media;
  }

  /**
   * Updates an existing media item
   * @param id - The ID of the media item to update
   * @param dto - Data transfer object containing the media fields to update
   * @param userId - ID of the user requesting the update (for authorization)
   * @returns Promise resolving to the updated MediaGallery object
   * @throws NotFoundException if the media item does not exist
   * @throws ForbiddenException if user doesn't own the media
   * @throws BadRequestException if the update operation fails
   */
  async updateMedia(id: string, dto: UpdateMediaGalleryDto, userId: string) {
    // Check if media exists and verify ownership
    const existingMedia = await this.prisma.mediaGallery.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    // Verify user authorization
    if (existingMedia.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this media',
      );
    }

    try {
      return await this.prisma.mediaGallery.update({
        where: { id },
        data: {
          ...dto,
          uploadedAt: existingMedia.uploadedAt,
          updatedAt: new Date(),
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update media - ${error.message}`,
      );
    }
  }

  /**
   * Deletes a media item from the gallery
   * @param id - The ID of the media item to delete
   * @param userId - ID of the user requesting the deletion (for authorization)
   * @returns Promise resolving to an object with success message
   * @throws NotFoundException if the media item does not exist
   * @throws ForbiddenException if user doesn't own the media
   */
  async deleteMedia(id: string, userId: string) {
    // Check if media exists and verify ownership
    const media = await this.prisma.mediaGallery.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    // Verify user authorization
    if (media.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this media',
      );
    }

    await this.prisma.mediaGallery.delete({
      where: { id },
    });

    await this.cloudinaryService.deleteFileFromCloudinary(media.publicId);

    return {
      message: 'Media deleted successfully',
    };
  }

  async bulkDeleteMediaBatched(ids: string[], userId: string, batchSize = 50) {
    if (ids.length <= batchSize) {
      return this.bulkDeleteMedia(ids, userId);
    }

    // Process in batches
    const batches = this.chunkArray(ids, batchSize);
    let totalDeleted = 0;
    const errors: any[] = [];

    // Process batches in parallel (but limit concurrency)
    const concurrencyLimit = 3;
    for (let i = 0; i < batches.length; i += concurrencyLimit) {
      const batchPromises = batches
        .slice(i, i + concurrencyLimit)
        .map((batch) =>
          this.bulkDeleteMedia(batch, userId)
            .then((result) => ({ success: true as const, count: result.count }))
            .catch((error) => ({ success: false as const, error, batch })),
        );

      const results = await Promise.all(batchPromises);

      results.forEach((result) => {
        if (result.success) {
          totalDeleted += result.count;
        } else {
          errors.push(result.error);
        }
      });
    }

    if (errors.length > 0) {
      console.error('Some batches failed:', errors);
    }

    if (errors.length > 0) {
      console.error('Some batches failed:', errors);
      // Handle partial failures as needed
    }

    return {
      message: 'Bulk deletion completed',
      count: totalDeleted,
      errors: errors.length,
    };
  }

  // Helper Methods To Delete Bulk Efficiently//========
  async bulkDeleteMedia(ids: string[], userId: string) {
    // Single query to get all data needed for validation and deletion
    const mediaItems = await this.prisma.mediaGallery.findMany({
      where: {
        id: { in: ids },
        userId: userId, // Filter by userId directly in query
      },
      select: {
        id: true,
        publicId: true,
        userId: true, // Keep for final validation if needed
      },
    });

    // Quick validation - if lengths don't match, some items don't exist or don't belong to user
    if (mediaItems.length !== ids.length) {
      // Optional: Find which specific items are missing/unauthorized
      const foundIds = new Set(mediaItems.map((item) => item.id));
      const missingIds = ids.filter((id) => !foundIds.has(id));

      throw new NotFoundException(
        `${missingIds.length} media items not found or unauthorized`,
      );
    }

    const publicIds = mediaItems.map((media) => media.publicId);

    // Execute database deletion and Cloudinary deletion in parallel
    const [deletedMedia] = await Promise.all([
      this.prisma.mediaGallery.deleteMany({
        where: {
          id: { in: ids },
          userId: userId, // Extra safety check
        },
      }),
      // Run Cloudinary deletion in background (don't await)
      this.cloudinaryService.deleteMultipleImages(publicIds).catch((error) => {
        // Log error but don't fail the operation
        console.error('Cloudinary deletion failed:', error);
      }),
    ]);

    return {
      message: 'Media deleted successfully',
      count: deletedMedia.count,
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  //===============================

  /**
   * Searches for media items based on specified criteria with filtering, sorting and pagination
   * @param query - Search query string
   * @param dto - Data transfer object containing search fields, filters and pagination options
   * @param userId - ID of the user requesting the search (for authorization)
   * @returns Promise resolving to object containing matched media items, total count and pagination info
   */
  async searchMedia(
    query: string,
    dto: MediaGalleryQueryDto & {
      searchFields?: string[];
    },
    userId?: string,
  ) {
    const {
      searchFields = ['originalName', 'altText', 'caption', 'tags'],
      sortBy = 'uploadedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      ...filters
    } = dto;

    const skip = (page - 1) * limit;
    const where = this.buildSearchWhereClause(
      query,
      searchFields,
      filters,
      userId,
    );
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const [mediaItems, total] = await Promise.all([
      this.prisma.mediaGallery.findMany({
        where,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.mediaGallery.count({ where }),
    ]);

    // Transform to list DTO
    const mediaList = mediaItems.map((media) => ({
      id: media.id,
      url: media.url,
      thumbnail: media.thumbnail,
      originalName: media.originalName,
      altText: media.altText,
      caption: media.caption,
      size: media.size,
      format: media.format,
      width: media.width,
      height: media.height,
      resourceType: media.resourceType,
      tags: media.tags,
      uploadedAt: media.uploadedAt,
    }));

    return {
      media: mediaList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Bulk update multiple media items
   * @param dto - Data transfer object containing media IDs and updates
   * @param userId - ID of the user requesting the bulk update (for authorization)
   * @returns Promise resolving to updated media items
   * @throws NotFoundException if any media item doesn't exist
   * @throws ForbiddenException if user doesn't own any of the media items
   */
  async bulkUpdateMedia(dto: BulkUpdateMediaGalleryDto, userId: string) {
    // Verify all media items exist and belong to the user
    const mediaItems = await this.prisma.mediaGallery.findMany({
      where: {
        id: { in: dto.ids },
      },
    });

    if (mediaItems.length !== dto.ids.length) {
      throw new NotFoundException('One or more media items not found');
    }

    // Verify ownership for all items
    const unauthorizedItems = mediaItems.filter(
      (media) => media.userId !== userId,
    );

    if (unauthorizedItems.length > 0) {
      throw new ForbiddenException(
        'You do not have permission to update some of the selected media items',
      );
    }

    // Perform bulk update
    await this.prisma.mediaGallery.updateMany({
      where: {
        id: { in: dto.ids },
      },
      data: dto.updates,
    });

    // Return updated items
    return await this.prisma.mediaGallery.findMany({
      where: {
        id: { in: dto.ids },
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get media items by public ID
   * @param publicId - The Cloudinary public ID
   * @param userId - ID of the user requesting the media (for authorization)
   * @returns Promise resolving to the MediaGallery object
   */
  async getMediaByPublicId(publicId: string, userId: string) {
    const media = await this.prisma.mediaGallery.findUnique({
      where: { publicId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException(`Media with public ID ${publicId} not found`);
    }

    // Verify user authorization
    if (media.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this media',
      );
    }

    return media;
  }

  /**
   * Get user's media statistics
   * @param userId - ID of the user
   * @returns Promise resolving to media statistics
   */
  async getUserMediaStats(userId: string) {
    const [totalCount, totalSize, formatStats, resourceTypeStats] =
      await Promise.all([
        this.prisma.mediaGallery.count({
          where: { userId },
        }),
        this.prisma.mediaGallery.aggregate({
          where: { userId },
          _sum: { size: true },
        }),
        this.prisma.mediaGallery.groupBy({
          by: ['format'],
          where: { userId },
          _count: { format: true },
        }),
        this.prisma.mediaGallery.groupBy({
          by: ['resourceType'],
          where: { userId },
          _count: { resourceType: true },
        }),
      ]);

    return {
      totalCount,
      totalSize: totalSize._sum.size || 0,
      formatBreakdown: formatStats.map((stat) => ({
        format: stat.format,
        count: stat._count.format,
      })),
      resourceTypeBreakdown: resourceTypeStats.map((stat) => ({
        resourceType: stat.resourceType,
        count: stat._count.resourceType,
      })),
    };
  }

  /**
   * Build where clause for filtering
   */
  private buildWhereClause(
    dto: Partial<MediaGalleryQueryDto>,
    userId?: string,
  ) {
    const where: Prisma.MediaGalleryWhereInput = {};

    // Always filter by userId if provided
    if (userId) {
      where.userId = userId;
    }

    if (dto.format) {
      where.format = {
        contains: dto.format,
        mode: 'insensitive',
      };
    }

    if (dto.resourceType) {
      where.resourceType = dto.resourceType;
    }

    if (dto.tags && dto.tags.length > 0) {
      where.tags = {
        hasSome: dto.tags,
      };
    }

    if (dto.minSize) {
      where.size = {
        gte: dto.minSize,
      };
    }

    if (dto.maxSize) {
      where.size = {
        lte: dto.maxSize,
      };
    }

    if (dto.minWidth) {
      where.width = {
        gte: dto.minWidth,
      };
    }

    if (dto.maxWidth) {
      where.width = {
        lte: dto.maxWidth,
      };
    }

    if (dto.minHeight) {
      where.height = {
        gte: dto.minHeight,
      };
    }

    if (dto.maxHeight) {
      where.height = {
        lte: dto.maxHeight,
      };
    }

    if (dto.uploadedAfter) {
      where.uploadedAt = {
        gte: dto.uploadedAfter,
      };
    }

    if (dto.uploadedBefore) {
      where.uploadedAt = {
        lte: dto.uploadedBefore,
      };
    }

    return where;
  }

  /**
   * Build search where clause
   */
  private buildSearchWhereClause(
    query: string,
    searchFields: string[],
    filters: Partial<MediaGalleryQueryDto>,
    userId?: string,
  ): Prisma.MediaGalleryWhereInput {
    const searchConditions: Prisma.MediaGalleryWhereInput[] = [];

    if (searchFields.includes('originalName')) {
      searchConditions.push({
        originalName: {
          contains: query,
          mode: 'insensitive',
        },
      });
    }

    if (searchFields.includes('altText')) {
      searchConditions.push({
        altText: {
          contains: query,
          mode: 'insensitive',
        },
      });
    }

    if (searchFields.includes('caption')) {
      searchConditions.push({
        caption: {
          contains: query,
          mode: 'insensitive',
        },
      });
    }

    if (searchFields.includes('tags')) {
      searchConditions.push({
        tags: {
          has: query,
        },
      });
    }

    const baseWhere = this.buildWhereClause(filters, userId);

    if (searchConditions.length > 0) {
      return {
        AND: [
          baseWhere,
          {
            OR: searchConditions,
          },
        ],
      };
    }

    return baseWhere;
  }

  /**
   * Build order by clause
   */
  private buildOrderBy(
    sortBy: string,
    sortOrder: 'desc' | 'asc',
  ): Prisma.MediaGalleryOrderByWithRelationInput {
    return {
      [sortBy]: sortOrder,
    };
  }
}
