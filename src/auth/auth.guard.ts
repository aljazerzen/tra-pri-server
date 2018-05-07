import {
  Guard,
  CanActivate,
  ExecutionContext,
  Request,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';

@Guard()
export class AuthGuard implements CanActivate {
  canActivate(request: Request, context: ExecutionContext) {

    const auth = request.headers['authorization'];
    if(!auth)
      throw new UnauthorizedException();

    if(auth !== process.env.CMS_PASSWORD)
      throw new BadRequestException('wrong password', 'INCORRECT_PASSWORD');

    return true;
  }
}
