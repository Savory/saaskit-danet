import { Module } from "danet/mod.ts";
import { TokenInjector } from "danet/mod.ts";
import { HardCodedAuthService } from "./hardcoded-auth.service.ts";

export const AUTH_SERVICE = "AUTH_SERVICE";

@Module({
  injectables: [
    new TokenInjector(HardCodedAuthService, AUTH_SERVICE),
  ],
})
export class AuthModule {
}
