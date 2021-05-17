import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from 'src/models/user';

export const CurrentUser = createParamDecorator(
  (data, req: ExecutionContext): UserInfo => {
    return req.switchToHttp().getRequest().user;
  },
);