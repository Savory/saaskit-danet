import { AuthGuard, ExecutionContext, Injectable } from "danet/mod.ts";
import { AuthService } from "./service.ts";

@Injectable()
export class UserConnected implements AuthGuard {
  constructor(private authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const bearerToken = context.request.headers.get("authorization");
    if (!bearerToken) {
      return false;
    }
    const [_, token] = bearerToken.split(" ");
    if (!token) {
      return false;
    }
    const userData = await this.authService.verifyToken(token);
    context.state.userId = userData._id;
    return true;
  }
}
