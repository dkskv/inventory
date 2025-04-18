import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const extractGqlRequest = (context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req;
};

export const extractRestRequest = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest();
};
