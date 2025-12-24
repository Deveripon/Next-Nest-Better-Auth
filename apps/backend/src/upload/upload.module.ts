import { Global, Module } from '@nestjs/common';
import { MediaGalleryModule } from 'src/media_gallery/media_gallery.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Global()
@Module({
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadModule],
  imports: [MediaGalleryModule],
})
export class UploadModule {}
