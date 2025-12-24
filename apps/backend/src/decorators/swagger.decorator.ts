import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

interface ApiDocOptions {
  summary: string;
  description?: string;
  response?: Type<any>;
  body?: Type<any>;
  isArray?: boolean;
  status?: number;
  deprecated?: boolean;
}

export function  ApiDoc({
  summary,
  description,
  response,
  body,
  isArray = false,
  status, // Let NestJS handle default status if not provided, or explicit
  deprecated = false,
}: ApiDocOptions) {
  const decorators = [ApiOperation({ summary, description, deprecated })];

  if (response) {
    decorators.push(
      ApiResponse({
        status: status || 200, // Default to 200 if not specified, though usually POST is 201. Better to match controller.
        // Actually, if I omit status in ApiResponse, it might default to 200.
        // But let's just use what's passed or default to 200/201 dynamically if possible? No.
        // Let's assume 200 mostly, or let the user pass it.
        description: 'Successful operation',
        type: response,
        isArray: isArray,
      }),
    );
  }

  if (body) {
    decorators.push(ApiBody({ type: body }));
  }

  return applyDecorators(...decorators);
}
