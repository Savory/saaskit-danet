import { AuthGuard, ExecutionContext, Injectable } from 'danet/mod.ts';
import { AuthService } from './service.ts';

@Injectable()
export class UserConnected implements AuthGuard {
  constructor(protected authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const bearerToken = context.request.headers.get('authorization');
    if (!bearerToken) {
      return false;
    }
    const [_, token] = bearerToken.split(' ');
    if (!token) {
      return false;
    }
    const userData = await this.authService.verifyToken(token);
    context.state.userId = userData._id;
    return true;
  }
}

@Injectable()
export class UserMayBeConnected extends UserConnected {
  constructor(protected authService: AuthService) {
    super(authService);
  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch (_e) {
      // user not connected but we don't care
    }
    return true;
  }
}
