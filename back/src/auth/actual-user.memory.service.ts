import { HttpContext, Inject, Injectable, SCOPE } from "danet/mod.ts";
import { User } from "../user/class.ts";
import { ActualUserService } from "./actual-user.service.ts";
import { BeforeControllerMethodIsCalled } from "danet/src/hook/interfaces.ts";
import { USER_REPOSITORY, type UserRepository } from "../user/repository.ts";
import { UpdateAccountDTO } from "./class.ts";

@Injectable({ scope: SCOPE.REQUEST })
export class InMemoryActualUserService
  implements ActualUserService, BeforeControllerMethodIsCalled {
  private actualUser?: User;
  constructor(@Inject(USER_REPOSITORY) private repository: UserRepository) {}

  async beforeControllerMethodIsCalled(ctx: HttpContext) {
    this.actualUser = await this.repository.getById(ctx.state.userId);
  }
  async get(): Promise<User> {
    if (this.actualUser) {
      return this.actualUser;
    }
    throw "User not connected";
  }

  async updateInfo(data: UpdateAccountDTO) {
    if (this.actualUser) {
      this.repository.updateOne(this.actualUser._id, data);
    }
  }
}
