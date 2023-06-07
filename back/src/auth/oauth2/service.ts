import { Injectable } from "danet/mod.ts";
import { OAuth2Client } from "oauth2_client/mod.ts";
import { AuthService } from "../service.ts";
import { Oauth2Provider } from "../class.ts";

@Injectable()
export class OAuth2Service {
  private clients = new Map<String, OAuth2Client>();

  constructor(
    private authService: AuthService,
  ) {
    this.clients.set(
      "google",
      new OAuth2Client({
        clientId: Deno.env.get("GOOGLE_CLIENT_ID")!,
        clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
        authorizationEndpointUri: "https://accounts.google.com/o/oauth2/auth",
        tokenUri: "https://accounts.google.com/o/oauth2/token",
        redirectUri: "http://localhost:3000/oauth2/callback",
        defaults: {
          scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
          ],
        },
      }),
    );
    this.clients.set(
      "discord",
      new OAuth2Client({
        clientId: Deno.env.get("DISCORD_CLIENT_ID")!,
        clientSecret: Deno.env.get("DISCORD_CLIENT_SECRET")!,
        authorizationEndpointUri: "https://discord.com/oauth2/authorize",
        tokenUri: "https://discord.com/api/oauth2/token",
        redirectUri: "http://localhost:3000/oauth2/callback",
        defaults: {
          scope: [
            "email",
            "identify",
          ],
        },
      }),
    );
  }

  async registerOrLoginUser(
    url: string,
    codeVerifier: string,
    provider: Oauth2Provider = "google",
  ) {
    const tokens = await this.getTokens(
      url,
      codeVerifier,
      provider,
    );
    const externalUserData = await this.getUser(
      tokens.accessToken,
      provider,
    );
    if (!externalUserData) {
      throw new Error("Cannot get user info from provider" + provider);
    }
    return this.authService.registerOrLoginOAuth2(
      externalUserData.email,
      externalUserData.username,
      provider,
    );
  }

  getAuthorizationUri(provider: string) {
    return this.clients.get(provider)!.code
      .getAuthorizationUri();
  }

  getTokens(url: string, codeVerifier: string, provider: string) {
    return this.clients.get(provider)!.code.getToken(url, {
      codeVerifier,
    });
  }

  async getUser(accessToken: string, provider: string) {
    if (provider === "google") {
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const user = await userResponse.json();
      return { email: user.email, username: user.name };
    } else if (provider === "discord") {
      const userResponse = await fetch(
        "https://discord.com/api/users/@me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const user = await userResponse.json();
      return { email: user.email, username: user.username };
    }
    return null;
  }
}
