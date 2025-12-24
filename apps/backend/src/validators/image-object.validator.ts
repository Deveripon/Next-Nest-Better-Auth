/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidImageObject(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidImageObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments): boolean {
          // Allow undefined or null (optional field)
          if (value === undefined || value === null) return true;

          // Must be object (and not array)
          if (typeof value !== 'object' || Array.isArray(value)) return false;

          // Check for valid url and public_id
          const hasUrl =
            typeof value.url === 'string' && value.url.trim().length > 0;
          const hasPublicId =
            typeof value.public_id === 'string' &&
            value.public_id.trim().length > 0;

          return hasUrl && hasPublicId;
        },
        defaultMessage(_args: ValidationArguments): string {
          return 'Image must contain both `url` and `public_id` as non-empty strings';
        },
      },
    });
  };
}
