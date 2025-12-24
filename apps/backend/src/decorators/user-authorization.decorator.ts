import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const AuthorizedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const userId = request.params.id || request.params.userId;

    if (user.id !== userId || user?.sub !== userId) {
      throw new ForbiddenException('Access Unauthorized');
    }

    return user;
  },
);

export const AuthenticatedUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('request', request.user);
    return request.user;
  },
);
