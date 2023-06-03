import { Injectable } from "danet/mod.ts";
import { create } from "jwt/mod.ts";
import { User } from "../user/class.ts";
import { OnAppBootstrap } from "danet/src/hook/interfaces.ts";

@Injectable()
export class AuthService implements OnAppBootstrap {
  private key!: CryptoKey;

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
}
