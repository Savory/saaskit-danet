import { Injectable } from "danet/mod.ts";
import { create, verify } from "jwt/mod.ts";
import { User } from "../user/class.ts";
import { OnAppBootstrap } from "danet/src/hook/interfaces.ts";
import { UserService } from "../user/service.ts";

@Injectable()
export class AuthService implements OnAppBootstrap {
  private key!: CryptoKey;

  constructor(
    private userService: UserService,
  ) {
  }

  async onAppBootstrap() {
    const jwtSecret = Deno.env.get("JWT_SECRET");
    if (!jwtSecret) {
      throw "MISSING JWT_SECRET";
    }
    const encoder = new TextEncoder();
    const keyBuf = encoder.encode("mySuperSecret");
    this.key = await crypto.subtle.importKey(
      "raw",
      keyBuf,
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );
  }
  generateUserToken(
    userData: Omit<User, "avatarUrl" | "isSubscribed">,
  ): Promise<string> {
    return create({ alg: "HS512", typ: "JWT" }, userData, this.key);
  }

  verifyToken(token: string) {
    return verify(token, this.key);
  }

  async registerUser(
    email: string,
    username: string,
    provider: string,
    password?: string,
  ): Promise<User> {
    if (provider === "local" && !password) {
      throw new Error("PasswordRequired");
    }
    return this.userService.createUser(email, username);
  }

  async registerOrLoginOAuth2(
    email: string,
    username: string,
  ) {
    let user = await this.userService.getUserByEmail(
      email,
    );
    if (!user) {
      user = await this.registerUser(email, username, "google");
    }
    return this.generateUserToken({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  }
}
