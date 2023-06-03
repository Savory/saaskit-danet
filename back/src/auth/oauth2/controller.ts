import {
  Controller,
  Get,
  HttpContext,
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
    private authService: AuthService,
    private oauth2Service: OAuth2Service,
    private userService: UserService,
  ) {
  }

  @Get("login")
  async login(@Session() session: OakSession, @Res() response: any) {
    const { uri, codeVerifier } = await this.oauth2Service
      .getAuthorizationUri();
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
    const tokens = await this.oauth2Service.getTokens(
      request.url,
      codeVerifier,
    );
    const externalUserData = await this.oauth2Service.getUser(
      tokens.accessToken,
    );
    const user = await this.userService.getOrCreateUser(
      externalUserData.email,
      externalUserData.name,
    );
    return this.authService.generateUserToken({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  }
}
