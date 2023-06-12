import { Injectable, SCOPE } from "danet/mod.ts";
import { User } from "../user/class.ts";
import { UpdateAccountDTO } from "./class.ts";

@Injectable({ scope: SCOPE.REQUEST })
export class HardCodedActualUserService {
  private user = {
    _id: "hardcodedUser",
    email: "hardcoded@email.com",
    username: "username",
  };

  constructor() {
  }

  async updateInfo(data: UpdateAccountDTO): Promise<void> {
    this.user = {
      ...this.user,
      ...data,
    };
  }
  async get(): Promise<User> {
    return this.user;
  }
}
