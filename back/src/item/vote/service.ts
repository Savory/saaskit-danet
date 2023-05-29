import { Inject, Injectable } from "danet/mod.ts";
import { Vote } from "./class.ts";
import { VOTE_REPOSITORY } from "./constant.ts";
import type { CommentRepository } from "./repository.ts";
import type { AuthService } from "../../auth/service.ts";
import { AUTH_SERVICE } from "../../auth/module.ts";

@Injectable()
export class VoteService {
  constructor(
    @Inject(VOTE_REPOSITORY) private repository: CommentRepository,
    @Inject(AUTH_SERVICE) private authService: AuthService,
  ) {}

  async upvote(itemId: string) {
    const user = await this.authService.getActualUser();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user.id,
    );
    if (userVoteOnitem) {
      throw new Error("userAlreadyVoted");
    }
    return this.repository.create(
      new Vote(itemId, user.id, new Date()),
    );
  }

  async getItemVoteCount(itemId: string) {
    return (await this.repository.getByItemId(itemId)).length;
  }

  async userHasVotedOnItem(itemId: string) {
    const user = await this.authService.getActualUser();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user.id,
    );
    return !!userVoteOnitem;
  }

  async removeUpvote(itemId: string) {
    const user = await this.authService.getActualUser();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user.id,
    );
    if (!userVoteOnitem) {
      throw new Error("userDidNotUpvote");
    }
    return this.repository.deleteOne(userVoteOnitem._id);
  }
}
