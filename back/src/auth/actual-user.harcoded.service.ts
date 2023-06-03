import { Injectable, SCOPE } from "danet/mod.ts";
import { User } from "../user/class.ts";
import { ActualUserService } from "./actual-user.service.ts";

@Injectable({ scope: SCOPE.REQUEST })
export class HardCodedActualUserService implements ActualUserService {
  async get(): Promise<User> {
    return {
      _id: "hardcodedUser",
      email: "hardcoded@email.com",
      username: "username",
    };
  }
}
