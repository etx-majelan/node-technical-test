import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
