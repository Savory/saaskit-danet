import { HttpContext, Injectable, SCOPE } from "danet/mod.ts";
import { User } from "../user/class.ts";
import { ActualUserService } from "./actual-user.service.ts";
import { UserService } from "../user/service.ts";
import { BeforeControllerMethodIsCalled } from "danet/src/hook/interfaces.ts";

@Injectable({ scope: SCOPE.REQUEST })
export class InMemoryActualUserService
  implements ActualUserService, BeforeControllerMethodIsCalled {
  private actualUser?: User;
  constructor(private userService: UserService) {}

  async beforeControllerMethodIsCalled(ctx: HttpContext) {
    this.actualUser = await this.userService.getMyInfo(ctx.state.userId);
  }
  async get(): Promise<User> {
    if (this.actualUser) {
      return this.actualUser;
    }
    throw "User not connected";
  }
}
