import { Injectable, SCOPE } from "danet/mod.ts";
import { User } from "../user/class.ts";
import { ActualUserService } from "./actual-user.service.ts";
import { HttpContext } from "https://deno.land/x/danet@1.7.4/src/router/router.ts";
import { UpdateAccountDTO } from "./class.ts";

@Injectable({ scope: SCOPE.REQUEST })
export class HardCodedActualUserService implements ActualUserService {
  private user = {
    _id: "hardcodedUser",
    email: "hardcoded@email.com",
    username: "username",
  };
  async beforeControllerMethodIsCalled(ctx: HttpContext): Promise<void> {
  }
  async updateInfo(data: UpdateAccountDTO): Promise<void> {
    this.user = {
      ...this.user,
      ...data,
    };
  }
  async get(): Promise<User> {
    return this.user;
  }
}
