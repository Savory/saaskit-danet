import { Injectable } from "danet/mod.ts";
import { Discord, Google, Preset } from "authenticus/mod.ts";
import { AuthService } from "../service.ts";
import { Oauth2Provider } from "../class.ts";

@Injectable()
export class OAuth2Service {
  private clients = new Map<string, Preset>();

  constructor(
    private authService: AuthService,
  ) {
    this.clients.set(
      "google",
      Google.setClientSecret(Deno.env.get("GOOGLE_CLIENT_SECRET")!).setClientId(
        Deno.env.get("GOOGLE_CLIENT_ID")!,
      ),
    );
    this.clients.set(
      "discord",
      Discord.setClientSecret(Deno.env.get("DISCORD_CLIENT_SECRET")!)
        .setClientId(Deno.env.get("DISCORD_CLIENT_ID")!),
    );
  }

  async registerOrLoginUser(
    codeVerifier: string,
    provider: Oauth2Provider = "google",
  ) {
    const tokens = await this.getTokens(
      codeVerifier,
      provider,
    );
    const externalUserData = await this.getUser(
      tokens.access_token,
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
    return this.clients.get(provider)!
      .getAuthorizeUrl({
        redirect_uri: `${Deno.env.get("HOSTNAME")}/oauth2/callback`,
      });
  }

  getTokens(codeVerifier: string, provider: string) {
    return this.clients.get(provider)!.getAccessToken({
      code: codeVerifier,
      redirect_uri: `${Deno.env.get("HOSTNAME")}/oauth2/callback`,
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
