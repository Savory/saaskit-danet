import { Inject, Injectable, NotFoundException } from "danet/mod.ts";
import { USER_REPOSITORY, type UserRepository } from "./repository.ts";
import { PublicUserInformation, User } from "./class.ts";
import { ConstructSignatureDeclaration } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";

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

  async getUserPublicInformation(
    userId: string,
  ): Promise<PublicUserInformation> {
    const user = await this.repository.getById(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      username: user?.username,
      avatarUrl: user?.avatarUrl,
      _id: user._id,
    };
  }

  async getMultipleUserPublicInformation(
    userIds: string[],
  ): Promise<PublicUserInformation[]> {
    const users = [];
    for (const userId of userIds) {
      const user = await this.repository.getById(userId);
      if (!user) {
        continue;
      }
      users.push({
        username: user?.username,
        avatarUrl: user?.avatarUrl,
        _id: user._id,
      });
    }
    return users;
  }
}
