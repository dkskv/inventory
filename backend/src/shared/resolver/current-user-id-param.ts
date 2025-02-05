import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractUserIdFromContext } from './extract-user-id-from-context';

export const CurrentUserId = createParamDecorator(
  (_: unknown, context: ExecutionContext) => extractUserIdFromContext(context),
);
