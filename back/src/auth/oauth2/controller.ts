import { Controller, Get, Param, Query, Req, Res, Session } from "danet/mod.ts";
import { Session as OakSession } from "session/mod.ts";
import { OAuth2Service } from "./service.ts";
import { Tag } from "danet_swagger/decorators.ts";
import { Oauth2Provider } from "../class.ts";
import { Code } from "https://deno.land/x/web_bson@v0.2.1/mod.ts";

@Tag("oauth2")
@Controller("oauth2")
export class OAuth2Controller {
  constructor(
    private oauth2Service: OAuth2Service,
  ) {
  }

  @Get("login/:provider")
  async login(
    @Session() session: OakSession,
    // deno-lint-ignore no-explicit-any
    @Res() response: any,
    @Param("provider") provider: string,
    // deno-lint-ignore no-explicit-any
    @Query() query: any,
  ) {
    const url = await this.oauth2Service
      .getAuthorizationUri(provider);
    session.flash("provider", provider);
    session.flash("redirectUrl", query.redirecturl);
    response.redirect(url);
  }

  @Get("callback")
  async callback(
    @Session() session: OakSession,
    // deno-lint-ignore no-explicit-any
    @Res() response: any,
    @Query("code", { value: "first" }) code: string,
  ) {
    // Make sure the codeVerifier is present for the user's session
    const redirectUrl = session.get("redirectUrl");
    const provider: Oauth2Provider = session.get("provider") as Oauth2Provider;
    const token = await this.oauth2Service.registerOrLoginUser(
      code,
      provider,
    );
    if (!redirectUrl) {
      return token;
    }
    response.redirect(redirectUrl + "?token=" + token);
  }
}
