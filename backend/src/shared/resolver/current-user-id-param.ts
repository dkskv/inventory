import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractUserIdFromRequest } from './extract-user-id-from-request';
import { extractGqlRequest } from './extract-request-from-context';

export const CurrentUserIdGql = createParamDecorator(
  (_: unknown, context: ExecutionContext) =>
    extractUserIdFromRequest(extractGqlRequest(context)),
);
