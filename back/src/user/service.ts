import { Inject, Injectable } from "danet/mod.ts";
import { USER_REPOSITORY, type UserRepository } from "./repository.ts";
import { User } from "./class.ts";

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private repository: UserRepository) {}

  async getOrCreateUser(email: string, username: string, provider = "google") {
    const userInDb = await this.repository.getByEmail(email);
    if (userInDb) {
      return userInDb;
    }
    return this.createUser(email, username, provider);
  }

  async createUser(
    email: string,
    username: string,
    provider: string,
    password?: string,
  ) {
    if (provider === "password") {
      if (!password) {
        throw new Error("Password Required");
      }
    }
    return this.repository.create(new User(email, username, password));
  }

  async getMyInfo(userId: string) {
    const user = await this.repository.getById(userId);
    return user;
  }
}
