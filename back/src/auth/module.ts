import { Module } from "danet/mod.ts";
import { OAuth2Controller } from "./oauth2/controller.ts";
import { OAuth2Service } from "./oauth2/service.ts";
import { AuthService } from "./service.ts";
import { AuthController } from "./controller.ts";
import { ActualUserService } from "./actual-user.service.ts";

@Module({
  controllers: [AuthController, OAuth2Controller],
  injectables: [
    AuthService,
    ActualUserService,
    OAuth2Service,
  ],
})
export class AuthModule {
}
