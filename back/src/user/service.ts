import { Inject, Injectable } from "danet/mod.ts";
import { USER_REPOSITORY, type UserRepository } from "./repository.ts";
import { User } from "./class.ts";

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private repository: UserRepository) {}

  async getOrCreateUser(email: string, username: string) {
    const userInDb = await this.repository.getByEmail(email);
    if (userInDb) {
      return userInDb;
    }
    return this.repository.create(new User(email, username));
  }
}
