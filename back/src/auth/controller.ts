import { Controller, Get, Inject, UseGuard } from "danet/mod.ts";
import { Tag } from "danet_swagger/decorators.ts";
import { UserConnected } from "./guard.ts";
import type { ActualUserService } from "./actual-user.service.ts";
import { ACTUAL_USER_SERVICE } from "./constant.ts";

@Tag("auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(ACTUAL_USER_SERVICE) private actualUserService: ActualUserService,
  ) {
  }

  @UseGuard(UserConnected)
  @Get("me")
  getMyInfo() {
    return this.actualUserService.get();
  }
}
