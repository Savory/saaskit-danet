import { Inject, Injectable, NotFoundException } from "danet/mod.ts";
import { USER_REPOSITORY, type UserRepository } from "./repository.ts";
import { PublicUserInformation, User } from "./class.ts";

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private repository: UserRepository) {}

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
