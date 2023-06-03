import { Module } from "danet/mod.ts";
import { TokenInjector } from "danet/mod.ts";
import { HardCodedAuthService } from "./hardcoded-auth.service.ts";
import { OAuth2Controller } from "./controller.ts";
import { OAuth2Service } from "./oauth2/service.ts";
import { AuthService } from "./service.ts";

export const ACTUAL_USER_SERVICE = "ACTUAL_USER_SERVICE";

@Module({
  controllers: [OAuth2Controller],
  injectables: [
    AuthService,
    new TokenInjector(HardCodedAuthService, ACTUAL_USER_SERVICE),
    OAuth2Service,
  ],
})
export class AuthModule {
}
