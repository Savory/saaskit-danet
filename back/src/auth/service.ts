import { Inject, Injectable } from "danet/mod.ts";
import { create, getNumericDate, verify } from "jwt/mod.ts";
import { User } from "../user/class.ts";
import { OnAppBootstrap } from "danet/src/hook/interfaces.ts";
import { USER_REPOSITORY, type UserRepository } from "../user/repository.ts";
import { isRegex } from "validatte/mod.ts";
import * as bcrypt from "bcrypt/mod.ts";
import { CreateUser } from "./class.ts";


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

  public generateUserToken(
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
    { username, password, provider, email }: CreateUser,
  ): Promise<string> {
    if (provider === "local") {
      if (!password) {
        throw new Error("PasswordRequired");
      }
      if (!isRegex(password, /^(?=.*[A-Za-z])(?=.*\d).{12,}$/)) {
        throw new Error("PasswordUnsafe");
      }
      password = await bcrypt.hash(password);
    }
    const userWithSameEmail = await this.userRepository.getByEmail(email);
    if (userWithSameEmail) throw new Error("UserWithEmailAlreadyExist");
    const user = await this.userRepository.create(
      new User(email, username, password),
    );
    return this.generateUserToken({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new Error("UserDoesNotExist");
    }
    if (!(await bcrypt.compare(password, user.password!))) {
      throw new Error("InvalidPassword");
    }
    return this.generateUserToken({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  }

  async registerOrLoginOAuth2(
    email: string,
    username: string,
    provider: Oauth2Provider,
  ) {
    let user = await this.userRepository.getByEmail(
      email,
    );
    if (!user) {
      return this.registerUser({ email, username, provider });
    }
    return this.generateUserToken({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  }
}
