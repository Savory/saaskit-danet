import { Inject, Injectable } from "danet/mod.ts";
import { USER_REPOSITORY, type UserRepository } from "./repository.ts";
import { User } from "./class.ts";

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private repository: UserRepository) {}

  async getUserByEmail(email: string) {
    return this.repository.getByEmail(email);
  }

  async createUser(
    email: string,
    username: string,
    password?: string,
  ) {
    return this.repository.create(new User(email, username, password));
  }

  async getMyInfo(userId: string) {
    const user = await this.repository.getById(userId);
    return user;
  }
}
