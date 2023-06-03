import { Module } from "danet/mod.ts";
import { TokenInjector } from "danet/mod.ts";
import { InMemoryActualUserService } from "./actual-user.memory.service.ts";
import { OAuth2Controller } from "./oauth2/controller.ts";
import { OAuth2Service } from "./oauth2/service.ts";
import { AuthService } from "./service.ts";
import { AuthController } from "./controller.ts";
import { ACTUAL_USER_SERVICE } from "./constant.ts";

@Module({
  controllers: [AuthController, OAuth2Controller],
  injectables: [
    AuthService,
    new TokenInjector(InMemoryActualUserService, ACTUAL_USER_SERVICE),
    OAuth2Service,
  ],
})
export class AuthModule {
}
