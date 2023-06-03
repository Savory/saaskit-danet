import { Injectable } from "danet/mod.ts";
import { OAuth2Client } from "oauth2_client/mod.ts";
import { UserService } from "../../user/service.ts";
import { AuthService } from "../service.ts";

@Injectable()
export class OAuth2Service {
  private client: OAuth2Client;

  constructor(
    private authService: AuthService,
  ) {
    this.client = new OAuth2Client({
      clientId: Deno.env.get("CLIENT_ID")!,
      clientSecret: Deno.env.get("CLIENT_SECRET")!,
      authorizationEndpointUri: "https://accounts.google.com/o/oauth2/auth",
      tokenUri: "https://accounts.google.com/o/oauth2/token",
      redirectUri: "http://localhost:3000/oauth2/callback",
      defaults: {
        scope: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
      },
    });
  }

  async registerOrLoginUser(url: string, codeVerifier: string) {
    const tokens = await this.getTokens(
      url,
      codeVerifier,
    );
    const externalUserData = await this.getUser(
      tokens.accessToken,
    );
    return this.authService.registerOrLoginOAuth2(
      externalUserData.email,
      externalUserData.name,
    );
  }

  getAuthorizationUri() {
    return this.client.code
      .getAuthorizationUri();
  }

  getTokens(url: string, codeVerifier: string) {
    return this.client.code.getToken(url, {
      codeVerifier,
    });
  }

  async getUser(accessToken: string) {
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return userResponse.json();
  }
}
