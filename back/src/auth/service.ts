import { Inject, Injectable } from "danet/mod.ts";
import { create, getNumericDate, verify } from "jwt/mod.ts";
import { User } from "../user/class.ts";
import { OnAppBootstrap } from "danet/src/hook/interfaces.ts";
import { USER_REPOSITORY, type UserRepository } from "../user/repository.ts";

@Injectable()
export class AuthService implements OnAppBootstrap {
  private key!: CryptoKey;

  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
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
    return create({ alg: "HS512", typ: "JWT" }, {
      ...userData,
      exp: getNumericDate(60 * 60),
    }, this.key);
  }

  verifyToken(token: string) {
    return verify(token, this.key);
  }

  async registerUser(
    email: string,
    username: string,
    provider: string,
    password?: string,
  ): Promise<string> {
    if (provider === "local" && !password) {
      throw new Error("PasswordRequired");
    }
    const user = await this.userRepository.create(
      new User(email, username, password),
    );
    return this.generateUserToken({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  }

  async registerOrLoginOAuth2(
    email: string,
    username: string,
  ) {
    let user = await this.userRepository.getByEmail(
      email,
    );
    if (!user) {
      return this.registerUser(email, username, "google");
    }
    return this.generateUserToken({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  }
}
