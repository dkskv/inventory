import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  extractGqlRequest,
  extractRestRequest,
} from 'src/shared/resolver/extract-request-from-context';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    return extractGqlRequest(context);
  }
}

@Injectable()
export class RestAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    return extractRestRequest(context);
  }
}
