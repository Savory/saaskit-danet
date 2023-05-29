import { Controller, Get, Req, Res, Session } from "danet/mod.ts";
import { Session as OakSession } from "session/mod.ts";
import { OAuth2Client } from "oauth2_client/mod.ts";

@Controller("oauth2")
export class OAuth2Controller {
  oauth2Client: OAuth2Client;
  constructor() {
    this.oauth2Client = new OAuth2Client({
      clientId: Deno.env.get("CLIENT_ID")!,
      clientSecret: Deno.env.get("CLIENT_SECRET")!,
      authorizationEndpointUri: "https://github.com/login/oauth/authorize",
      tokenUri: "https://github.com/login/oauth/access_token",
      redirectUri: "http://localhost:3000/oauth2/callback",
      defaults: {
        scope: "read:user",
      },
    });
  }

  @Get("login")
  async login(@Session() session: OakSession, @Res() response: any) {
    const { uri, codeVerifier } = await this.oauth2Client.code
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

    // Exchange the authorization code for an access token
    const tokens = await this.oauth2Client.code.getToken(request.url, {
      codeVerifier,
    });

    console.log(tokens);

    // Use the access token to make an authenticated API request
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const user = await userResponse.json();
    console.log(user);
    return user.login;
  }
}
