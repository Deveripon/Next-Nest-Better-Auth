/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDoc } from '../decorators/swagger.decorator';

import { AuthGuard } from '@nestjs/passport';
import {
  BulkUpdateMediaGalleryDto,
  CreateMediaGalleryDto,
  MediaGalleryQueryDto,
  UpdateMediaGalleryDto,
} from './dto/media_gallery.dto';
import { MediaGalleryService } from './media_gallery.service';

@ApiTags('Media Gallery')
@Controller({
  path: 'media-gallery',
  version: '1',
})
export class MediaGalleryController {
  constructor(private readonly mediaGalleryService: MediaGalleryService) {}

  @ApiDoc({
    summary: 'Upload media item',
    description: 'Uploads a new media item to the gallery. Returns uploaded media details.',
    response: CreateMediaGalleryDto, // Actually returns created object, let's use MediaUploadResponseDto if possible, or MediaGalleryDto
    status: HttpStatus.CREATED,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async uploadMedia(@Body() dto: CreateMediaGalleryDto, @Request() req: any) {
    return this.mediaGalleryService.uploadMedia(dto, req.user.id);
  }

  @ApiDoc({
    summary: 'Get all media',
    description: 'Retrieves all media items with filtering, sorting, and pagination.',
    // response: [MediaGalleryDto], // Array? Or paginated object. Let's omit response type for now or use MediaGalleryDto as array
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllMedia(@Query() dto: MediaGalleryQueryDto, @Request() req: any) {
    return this.mediaGalleryService.getAllMedia(dto, req.user.id);
  }

  @ApiDoc({
    summary: 'Get user media',
    description: 'Retrieves media items uploaded by a specific user.',
    status: HttpStatus.OK,
  })
  @Get('user/:userId')
  async getAllMediaOfUser(
    @Query() dto: MediaGalleryQueryDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.mediaGalleryService.getAllMedia(dto, userId);
  }

  @ApiDoc({
    summary: 'Search media',
    description: 'Search media items by query string across multiple fields.',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  async searchMedia(
    @Query('q') query: string,
    @Query()
    dto: MediaGalleryQueryDto & {
      searchFields?: string[];
    },
    @Request() req: any,
  ) {
    const { userId, ...queryDto } = dto;
    return this.mediaGalleryService.searchMedia(query, queryDto, req.user.id);
  }

  @ApiDoc({
    summary: 'Get user media stats',
    description: 'Get comprehensive statistics about a user\'s media gallery.',
    status: HttpStatus.OK,
  })
  @Get('stats/user/:userId')
  async getUserMediaStats(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.mediaGalleryService.getUserMediaStats(userId);
  }

  @ApiDoc({
    summary: 'Get media by public ID',
    description: 'Retrieves a media item using its Cloudinary public ID.',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('by-public-id')
  async getMediaByPublicId(
    @Query('publicId') publicId: string,
    @Request() req: any,
  ) {
    return this.mediaGalleryService.getMediaByPublicId(publicId, req.user.id);
  }

  @ApiDoc({
    summary: 'Get single media',
    description: 'Retrieves a specific media item by ID.',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getSingleMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.mediaGalleryService.getSingleMedia(id, req.user.id);
  }

  @ApiDoc({
    summary: 'Update media',
    description: 'Updates an existing media item.',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMediaGalleryDto,
    @Request() req: any,
  ) {
    return this.mediaGalleryService.updateMedia(id, dto, req.user.id);
  }

  @ApiDoc({
    summary: 'Bulk update media',
    description: 'Updates multiple media items at once.',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('bulk/update')
  async bulkUpdateMedia(
    @Body() dto: BulkUpdateMediaGalleryDto,
    @Request() req: any,
  ) {
    return this.mediaGalleryService.bulkUpdateMedia(dto, req.user.id);
  }

  @ApiDoc({
    summary: 'Delete media',
    description: 'Deletes a media item by ID. This action is irreversible.',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.mediaGalleryService.deleteMedia(id, req.user.id);
  }

  @ApiDoc({
    summary: 'Bulk delete media',
    description: 'Deletes multiple media items at once.',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete('bulk/delete')
  async bulkDeleteMedia(@Body('ids') ids: string[], @Request() req: any) {
    return this.mediaGalleryService.bulkDeleteMediaBatched(ids, req.user.id);
  }
}
