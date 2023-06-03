import {
  Controller,
  Get,
  HttpContext,
  Param,
  Query,
  Req,
  Res,
  Session,
  UseGuard,
} from "danet/mod.ts";
import { Session as OakSession } from "session/mod.ts";
import { OAuth2Service } from "./service.ts";
import { UserService } from "../../user/service.ts";
import { Tag } from "danet_swagger/decorators.ts";
import { AuthService } from "../service.ts";

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
    @Res() response: any,
    @Param("provider") provider: string,
  ) {
    const { uri, codeVerifier } = await this.oauth2Service
      .getAuthorizationUri(provider);
    session.flash("codeVerifier", codeVerifier);
    response.redirect(uri);
  }

  @Get("callback")
  async callback(@Session() session: OakSession, @Req() request: Request) {
    // Make sure the codeVerifier is present for the user's session
    const codeVerifier = session.get("codeVerifier");
    if (typeof codeVerifier !== "string") {
      throw new Error("invalid codeVerifier");
    }
    return this.oauth2Service.registerOrLoginUser(request.url, codeVerifier);
  }
}
