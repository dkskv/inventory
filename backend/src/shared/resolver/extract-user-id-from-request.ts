import { ExecutionContext } from '@nestjs/common';
import { get, isNumber } from 'lodash';

export const extractUserIdFromRequest = (request: ExecutionContext) => {
  const userId = get(request, ['user', 'sub']);

  if (!isNumber(userId)) {
    throw new Error('user not found');
  }

  return userId;
};
