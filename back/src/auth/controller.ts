import { Body, Controller, Get, Inject, Patch, UseGuard } from "danet/mod.ts";
import { ApiBearerAuth, ReturnedType, Tag } from "danet_swagger/decorators.ts";
import { UserConnected } from "./guard.ts";
import { ActualUserService } from "./actual-user.service.ts";
import { ACTUAL_USER_SERVICE } from "./constant.ts";
import { User } from "../user/class.ts";
import { UpdateAccountDTO } from "./class.ts";

@Tag("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private actualUserService: ActualUserService,
  ) {
  }

  @UseGuard(UserConnected)
  @ApiBearerAuth()
  @Get("me")
  @ReturnedType(User)
  getMyInfo() {
    return this.actualUserService.get();
  }

  @UseGuard(UserConnected)
  @ApiBearerAuth()
  @Patch("me")
  updateInfo(@Body() newAccountData: UpdateAccountDTO) {
    return this.actualUserService.updateInfo(newAccountData);
  }
}
