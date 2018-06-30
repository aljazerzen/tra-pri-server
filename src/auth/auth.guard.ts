import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {

    const auth = context.switchToHttp().getRequest().headers.authorization;
    if(!auth)
      throw new UnauthorizedException();

    if(auth !== process.env.CMS_PASSWORD)
      throw new BadRequestException('wrong password', 'INCORRECT_PASSWORD');

    return true;
  }
}
