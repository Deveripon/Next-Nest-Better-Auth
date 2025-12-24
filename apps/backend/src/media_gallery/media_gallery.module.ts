// media-gallery.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MediaGalleryController } from './media_gallery.controller';
import { MediaGalleryService } from './media_gallery.service';

@Module({
  controllers: [MediaGalleryController],
  providers: [MediaGalleryService],
  imports: [CloudinaryModule],
  exports: [MediaGalleryService],
})
export class MediaGalleryModule {}
