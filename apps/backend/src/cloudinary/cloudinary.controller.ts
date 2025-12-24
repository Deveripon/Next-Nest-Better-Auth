import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Cloudinary')
@Controller({
  path: 'cloudinary',
  version: '1',
})
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
}
