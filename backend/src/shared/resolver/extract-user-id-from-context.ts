import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { get, isNumber } from 'lodash';

export const extractUserIdFromContext = (context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  const userId = get(ctx.getContext(), ['req', 'user', 'sub']);

  if (!isNumber(userId)) {
    throw new Error('user not found');
  }

  return userId;
};
