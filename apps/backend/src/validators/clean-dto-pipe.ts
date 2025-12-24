import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// Alternative: Use a custom pipe
@Injectable()
export class CleanUndefinedPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    const cleaned = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined) {
        cleaned[key] = val;
      }
    }

    return cleaned;
  }
}
